package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/yourusername/health-competition-go/internal/config"
	"github.com/yourusername/health-competition-go/internal/handlers"
	"github.com/yourusername/health-competition-go/internal/middleware"
	"github.com/yourusername/health-competition-go/internal/services"
	"github.com/yourusername/health-competition-go/pkg/storage"
	"github.com/yourusername/health-competition-go/pkg/utils"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"golang.org/x/time/rate"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize logger
	logger := utils.NewLogger(cfg.LogLevel)
	logger.Info("Starting Go Service...")

	// Initialize metrics
	metrics := utils.NewMetrics()
	logger.Info("Metrics initialized")

	// Initialize database
	var db *sql.DB
	databaseURL := cfg.DatabaseURL
	if databaseURL == "" {
		// For local development without external database
		logger.Info("No DATABASE_URL provided, running without direct database connection")
		db = nil
	} else {
		// Ensure SSL mode is properly configured for local development
		if strings.Contains(databaseURL, "localhost") || strings.Contains(databaseURL, "127.0.0.1") {
			if !strings.Contains(databaseURL, "sslmode=") {
				databaseURL += "?sslmode=disable"
			}
		}

		var err error
		db, err = sql.Open("postgres", databaseURL)
		if err != nil {
			log.Fatalf("Failed to connect to database: %v", err)
		}

		// Configure connection pool
		db.SetMaxOpenConns(25)
		db.SetMaxIdleConns(5)
		db.SetConnMaxLifetime(5 * time.Minute)

		// Test database connection
		if err := db.Ping(); err != nil {
			log.Fatalf("Failed to ping database: %v", err)
		}
		logger.Info("Database connected successfully")
	}

	// Initialize services
	redisClient := services.NewRedisClient(cfg.RedisURL)
	cacheService := services.NewCacheService(redisClient)
	leaderboardService := services.NewLeaderboardService(cacheService, redisClient)
	fitnessService := services.NewFitnessService(cacheService, cfg.SupabaseURL)

	// Initialize Supabase Storage
	supabaseStorage, err := storage.NewSupabaseStorage()
	if err != nil {
		logger.Warnf("Failed to initialize Supabase Storage: %v", err)
		logger.Warn("Avatar uploads will not work without Supabase Storage configuration")
	}

	// Initialize services that need database connection
	var competitionService *services.CompetitionService
	var userService *services.UserService

	if db != nil {
		competitionService = services.NewCompetitionService(db, cacheService)
		userService = services.NewUserService(db, cacheService)
		logger.Info("Database services initialized")
	} else {
		logger.Info("Running without database services (API-only mode)")
	}

	// Initialize health checker
	healthChecker := utils.NewHealthChecker(db, redisClient, "1.0.0")
	logger.Info("Health checker initialized")

	// Initialize WebSocket hub
	wsHub := handlers.NewHub(leaderboardService, logger)
	go wsHub.Run()

	// Initialize handlers
	leaderboardHandler := handlers.NewLeaderboardHandler(leaderboardService, logger)
	fitnessHandler := handlers.NewFitnessHandler(fitnessService, logger)
	wsHandler := handlers.NewWebSocketHandler(wsHub, leaderboardService, logger)

	var competitionHandler *handlers.CompetitionHandler
	var userHandler *handlers.UserHandler

	if competitionService != nil && userService != nil {
		competitionHandler = handlers.NewCompetitionHandler(competitionService, logger)
		userHandler = handlers.NewUserHandler(userService, logger, supabaseStorage)
	}

	// Setup router
	r := mux.NewRouter()

	// Middleware
	r.Use(middleware.LoggingMiddleware(logger))
	r.Use(middleware.RecoveryMiddleware(logger))

	// Rate limiting (100 requests per second, burst of 200)
	rateLimiter := middleware.NewRateLimiter(rate.Limit(100), 200)
	r.Use(middleware.RateLimitMiddleware(rateLimiter))

	// Public routes
	r.HandleFunc("/health", healthCheckHandler).Methods("GET")
	r.HandleFunc("/health/live", healthChecker.LivenessHandler()).Methods("GET")
	r.HandleFunc("/health/ready", healthChecker.ReadinessHandler()).Methods("GET")
	r.HandleFunc("/health/detailed", healthChecker.DetailedHealthHandler()).Methods("GET")
	r.Handle("/metrics", metrics.Handler()).Methods("GET")

	// API routes (require authentication)
	api := r.PathPrefix("/api/v1").Subrouter()
	api.Use(middleware.AuthMiddleware(cfg.SupabaseJWTSecret))

	// Leaderboard routes
	api.HandleFunc("/leaderboard/{competitionId}", leaderboardHandler.GetLeaderboard).Methods("GET")
	api.HandleFunc("/leaderboard/update", leaderboardHandler.UpdateScore).Methods("POST")

	// Fitness routes
	api.HandleFunc("/fitness/sync", fitnessHandler.SyncFitnessData).Methods("POST")
	api.HandleFunc("/fitness/stats/{userId}", fitnessHandler.GetUserStats).Methods("GET")

	// Competition routes (require database)
	if competitionHandler != nil {
		api.HandleFunc("/competitions", competitionHandler.GetCompetitions).Methods("GET")
		api.HandleFunc("/competitions", competitionHandler.CreateCompetition).Methods("POST")
		api.HandleFunc("/competitions/{id}", competitionHandler.GetCompetition).Methods("GET")
		api.HandleFunc("/competitions/{id}/join", competitionHandler.JoinCompetition).Methods("POST")
		api.HandleFunc("/users/{userId}/competitions", competitionHandler.GetUserCompetitions).Methods("GET")
	}

	// User routes (require database)
	if userHandler != nil {
		api.HandleFunc("/users/{userId}/dashboard", userHandler.GetDashboardStats).Methods("GET")
		api.HandleFunc("/users/{userId}/profile", userHandler.GetUserProfile).Methods("GET")
		api.HandleFunc("/users/{userId}/profile", userHandler.UpdateUserProfile).Methods("PUT")
		api.HandleFunc("/users/{userId}/avatar", userHandler.UploadAvatar).Methods("POST")
		api.HandleFunc("/users/{userId}/activity", userHandler.GetUserActivity).Methods("GET")
		api.HandleFunc("/users/{userId}/transactions", userHandler.GetUserTransactions).Methods("GET")
	}

	// Serve static files (uploaded avatars)
	r.PathPrefix("/uploads/").Handler(http.StripPrefix("/uploads/", http.FileServer(http.Dir("uploads"))))

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

	// Start server
	logger.Info("Server starting on port " + cfg.Port)
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Server failed to start: %v", err)
	}

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info("Server shutting down...")

	// Close database connection if available
	if db != nil {
		db.Close()
		logger.Info("Database connection closed")
	}

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
