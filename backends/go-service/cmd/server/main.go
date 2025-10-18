package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/yourusername/health-competition-go/internal/config"
	"github.com/yourusername/health-competition-go/internal/handlers"
	"github.com/yourusername/health-competition-go/internal/middleware"
	"github.com/yourusername/health-competition-go/internal/services"
	"github.com/yourusername/health-competition-go/pkg/utils"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize logger
	logger := utils.NewLogger(cfg.LogLevel)

	// Initialize services
	redisClient := services.NewRedisClient(cfg.RedisURL)
	cacheService := services.NewCacheService(redisClient)
	leaderboardService := services.NewLeaderboardService(cacheService, redisClient)
	fitnessService := services.NewFitnessService(cacheService, cfg.SupabaseURL)

	// Initialize WebSocket hub
	wsHub := handlers.NewHub(leaderboardService, logger)
	go wsHub.Run()

	// Initialize handlers
	leaderboardHandler := handlers.NewLeaderboardHandler(leaderboardService, logger)
	fitnessHandler := handlers.NewFitnessHandler(fitnessService, logger)
	wsHandler := handlers.NewWebSocketHandler(wsHub, leaderboardService, logger)

	// Setup router
	r := mux.NewRouter()

	// Middleware
	r.Use(middleware.LoggingMiddleware(logger))
	r.Use(middleware.RecoveryMiddleware(logger))

	// Public routes
	r.HandleFunc("/health", healthCheckHandler).Methods("GET")

	// API routes (require authentication)
	api := r.PathPrefix("/api/v1").Subrouter()
	api.Use(middleware.AuthMiddleware(cfg.SupabaseJWTSecret))

	// Leaderboard routes
	api.HandleFunc("/leaderboard/{competitionId}", leaderboardHandler.GetLeaderboard).Methods("GET")
	api.HandleFunc("/leaderboard/update", leaderboardHandler.UpdateScore).Methods("POST")

	// Fitness routes
	api.HandleFunc("/fitness/sync", fitnessHandler.SyncFitnessData).Methods("POST")
	api.HandleFunc("/fitness/stats/{userId}", fitnessHandler.GetUserStats).Methods("GET")

	// Prize routes
	api.HandleFunc("/prizes/calculate/{competitionId}", leaderboardHandler.CalculatePrizes).Methods("POST")
	api.HandleFunc("/prizes/distribute/{competitionId}", leaderboardHandler.DistributePrizes).Methods("POST")

	// WebSocket route (with auth in query param)
	r.HandleFunc("/ws/leaderboard/{competitionId}", wsHandler.HandleWebSocket)

	// CORS configuration
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Configure based on your needs
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	// Server configuration
	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      handler,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in goroutine
	go func() {
		logger.Info("Server starting on port " + cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info("Server shutting down...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	logger.Info("Server exited")
}

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"healthy","service":"go-backend"}`))
}
