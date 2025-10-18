package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"sync"
	"time"

	"github.com/yourusername/health-competition-go/internal/middleware"
	"github.com/yourusername/health-competition-go/internal/models"
	"github.com/yourusername/health-competition-go/internal/services"
	"github.com/yourusername/health-competition-go/pkg/utils"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Configure based on your needs
	},
}

// Client represents a WebSocket client
type Client struct {
	ID            string
	UserID        string
	CompetitionID string
	Conn          *websocket.Conn
	Hub           *Hub
	Send          chan []byte
}

// Hub maintains active WebSocket connections
type Hub struct {
	clients          map[*Client]bool
	broadcast        chan []byte
	register         chan *Client
	unregister       chan *Client
	mu               sync.RWMutex
	leaderboardSvc   *services.LeaderboardService
	logger           *utils.Logger
	competitions     map[string]map[*Client]bool // competitionID -> clients
}

// NewHub creates a new WebSocket hub
func NewHub(leaderboardSvc *services.LeaderboardService, logger *utils.Logger) *Hub {
	return &Hub{
		clients:        make(map[*Client]bool),
		broadcast:      make(chan []byte),
		register:       make(chan *Client),
		unregister:     make(chan *Client),
		leaderboardSvc: leaderboardSvc,
		logger:         logger,
		competitions:   make(map[string]map[*Client]bool),
	}
}

// Run starts the hub
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			
			// Add to competition-specific room
			if h.competitions[client.CompetitionID] == nil {
				h.competitions[client.CompetitionID] = make(map[*Client]bool)
			}
			h.competitions[client.CompetitionID][client] = true
			h.mu.Unlock()
			
			h.logger.Infof("Client registered: %s for competition %s", client.UserID, client.CompetitionID)

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				delete(h.competitions[client.CompetitionID], client)
				close(client.Send)
			}
			h.mu.Unlock()
			
			h.logger.Infof("Client unregistered: %s", client.UserID)

		case message := <-h.broadcast:
			h.mu.RLock()
			for client := range h.clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(h.clients, client)
				}
			}
			h.mu.RUnlock()
		}
	}
}

// BroadcastToCompetition broadcasts a message to all clients in a specific competition
func (h *Hub) BroadcastToCompetition(competitionID string, message []byte) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	if clients, ok := h.competitions[competitionID]; ok {
		for client := range clients {
			select {
			case client.Send <- message:
			default:
				close(client.Send)
				delete(h.clients, client)
				delete(h.competitions[competitionID], client)
			}
		}
	}
}

// WebSocketHandler handles WebSocket connections
type WebSocketHandler struct {
	hub            *Hub
	leaderboardSvc *services.LeaderboardService
	logger         *utils.Logger
}

func NewWebSocketHandler(hub *Hub, leaderboardSvc *services.LeaderboardService, logger *utils.Logger) *WebSocketHandler {
	return &WebSocketHandler{
		hub:            hub,
		leaderboardSvc: leaderboardSvc,
		logger:         logger,
	}
}

// HandleWebSocket handles WebSocket connections
func (h *WebSocketHandler) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	competitionID := vars["competitionId"]

	// Get token from query param
	token := r.URL.Query().Get("token")
	if token == "" {
		http.Error(w, "Token required", http.StatusUnauthorized)
		return
	}

	// Validate token (you should get JWT secret from config)
	userID, err := middleware.ValidateTokenFromQuery(token, "your-jwt-secret")
	if err != nil {
		h.logger.Errorf("Token validation failed: %v", err)
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	// Upgrade connection
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		h.logger.Errorf("WebSocket upgrade failed: %v", err)
		return
	}

	// Create client
	client := &Client{
		ID:            userID + "-" + time.Now().String(),
		UserID:        userID,
		CompetitionID: competitionID,
		Conn:          conn,
		Hub:           h.hub,
		Send:          make(chan []byte, 256),
	}

	// Register client
	h.hub.register <- client

	// Start goroutines for reading and writing
	go client.writePump()
	go client.readPump()

	// Send initial leaderboard
	h.sendInitialLeaderboard(client)
}

// sendInitialLeaderboard sends the current leaderboard to a newly connected client
func (h *WebSocketHandler) sendInitialLeaderboard(client *Client) {
	leaderboard, err := h.leaderboardSvc.GetLeaderboard(context.Background(), client.CompetitionID, 100)
	if err != nil {
		h.logger.Errorf("Failed to get initial leaderboard: %v", err)
		return
	}

	message := models.WebSocketMessage{
		Type:      "leaderboard_update",
		Data:      leaderboard,
		Timestamp: time.Now(),
	}

	messageBytes, err := json.Marshal(message)
	if err != nil {
		h.logger.Errorf("Failed to marshal message: %v", err)
		return
	}

	client.Send <- messageBytes
}

// readPump reads messages from the WebSocket connection
func (c *Client) readPump() {
	defer func() {
		c.Hub.unregister <- c
		c.Conn.Close()
	}()

	c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				// Log error
			}
			break
		}

		// Handle incoming messages (e.g., subscribe to specific updates)
		var msg models.WebSocketMessage
		if err := json.Unmarshal(message, &msg); err == nil {
			// Process message based on type
			switch msg.Type {
			case "subscribe":
				// Handle subscription
			case "ping":
				// Send pong
				c.Send <- []byte(`{"type":"pong"}`)
			}
		}
	}
}

// writePump writes messages to the WebSocket connection
func (c *Client) writePump() {
	ticker := time.NewTicker(54 * time.Second)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Add queued messages
			n := len(c.Send)
			for i := 0; i < n; i++ {
				w.Write([]byte{'\n'})
				w.Write(<-c.Send)
			}

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
