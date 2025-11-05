package integration

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/yourusername/health-competition-go/internal/handlers"
	"github.com/yourusername/health-competition-go/internal/middleware"
	"github.com/yourusername/health-competition-go/internal/models"
	"github.com/yourusername/health-competition-go/internal/services"
	"github.com/yourusername/health-competition-go/pkg/utils"

	"github.com/alicebob/miniredis/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"github.com/redis/go-redis/v9"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type TestServer struct {
	router      *mux.Router
	redisClient *redis.Client
	miniRedis   *miniredis.Miniredis
	jwtSecret   string
}

func setupTestServer(t *testing.T) *TestServer {
	// Setup mini redis
	mr, err := miniredis.Run()
	require.NoError(t, err)

	client := redis.NewClient(&redis.Options{
		Addr: mr.Addr(),
	})

	// Initialize services
	cacheService := services.NewCacheService(client)
	leaderboardService := services.NewLeaderboardService(cacheService, client)
	fitnessService := services.NewFitnessService(cacheService, "http://localhost:54321")

	// Initialize logger
	logger := utils.NewLogger("debug")

	// Initialize handlers
	leaderboardHandler := handlers.NewLeaderboardHandler(leaderboardService, logger)
	fitnessHandler := handlers.NewFitnessHandler(fitnessService, logger)

	// Setup router
	r := mux.NewRouter()
	jwtSecret := "test-jwt-secret-key-for-testing-only"

	// Middleware
	r.Use(middleware.LoggingMiddleware(logger))
	r.Use(middleware.RecoveryMiddleware(logger))

	// API routes
	api := r.PathPrefix("/api/v1").Subrouter()
	api.Use(middleware.AuthMiddleware(jwtSecret))

	// Leaderboard routes
	api.HandleFunc("/leaderboard/{competitionId}", leaderboardHandler.GetLeaderboard).Methods("GET")
	api.HandleFunc("/leaderboard/update", leaderboardHandler.UpdateScore).Methods("POST")

	// Fitness routes
	api.HandleFunc("/fitness/sync", fitnessHandler.SyncFitnessData).Methods("POST")
	api.HandleFunc("/fitness/stats/{userId}", fitnessHandler.GetUserStats).Methods("GET")

	return &TestServer{
		router:      r,
		redisClient: client,
		miniRedis:   mr,
		jwtSecret:   jwtSecret,
	}
}

func (ts *TestServer) Close() {
	ts.miniRedis.Close()
	ts.redisClient.Close()
}

func (ts *TestServer) generateToken(userID string) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(time.Hour).Unix(),
		"iat": time.Now().Unix(),
	})

	tokenString, _ := token.SignedString([]byte(ts.jwtSecret))
	return tokenString
}

func TestAPI_LeaderboardUpdate(t *testing.T) {
	ts := setupTestServer(t)
	defer ts.Close()

	userID := "test-user-1"
	token := ts.generateToken(userID)

	req := models.ScoreUpdateRequest{
		UserID:        userID,
		CompetitionID: "comp-1",
		Steps:         10000,
		Distance:      8.5,
		Calories:      500,
	}

	body, _ := json.Marshal(req)
	httpReq := httptest.NewRequest("POST", "/api/v1/leaderboard/update", bytes.NewBuffer(body))
	httpReq.Header.Set("Authorization", "Bearer "+token)
	httpReq.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	ts.router.ServeHTTP(w, httpReq)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.SuccessResponse
	err := json.NewDecoder(w.Body).Decode(&response)
	assert.NoError(t, err)
	assert.True(t, response.Success)
}

func TestAPI_GetLeaderboard(t *testing.T) {
	ts := setupTestServer(t)
	defer ts.Close()

	competitionID := "comp-1"

	// Add some test data
	ctx := context.Background()
	cacheService := services.NewCacheService(ts.redisClient)
	leaderboardService := services.NewLeaderboardService(cacheService, ts.redisClient)

	users := []struct {
		userID string
		steps  int64
	}{
		{"user-1", 15000},
		{"user-2", 12000},
		{"user-3", 18000},
	}

	for _, u := range users {
		req := &models.ScoreUpdateRequest{
			UserID:        u.userID,
			CompetitionID: competitionID,
			Steps:         u.steps,
		}
		leaderboardService.UpdateScore(ctx, req)
	}

	// Make request
	token := ts.generateToken("user-1")
	httpReq := httptest.NewRequest("GET", "/api/v1/leaderboard/"+competitionID, nil)
	httpReq.Header.Set("Authorization", "Bearer "+token)

	w := httptest.NewRecorder()
	ts.router.ServeHTTP(w, httpReq)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.SuccessResponse
	err := json.NewDecoder(w.Body).Decode(&response)
	assert.NoError(t, err)
	assert.True(t, response.Success)

	// Verify leaderboard data
	leaderboardData, ok := response.Data.(map[string]interface{})
	assert.True(t, ok)
	entries, ok := leaderboardData["entries"].([]interface{})
	assert.True(t, ok)
	assert.Equal(t, 3, len(entries))
}

func TestAPI_UnauthorizedAccess(t *testing.T) {
	ts := setupTestServer(t)
	defer ts.Close()

	// Request without token
	httpReq := httptest.NewRequest("GET", "/api/v1/leaderboard/comp-1", nil)
	w := httptest.NewRecorder()
	ts.router.ServeHTTP(w, httpReq)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestAPI_InvalidToken(t *testing.T) {
	ts := setupTestServer(t)
	defer ts.Close()

	// Request with invalid token
	httpReq := httptest.NewRequest("GET", "/api/v1/leaderboard/comp-1", nil)
	httpReq.Header.Set("Authorization", "Bearer invalid-token")
	w := httptest.NewRecorder()
	ts.router.ServeHTTP(w, httpReq)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestAPI_FitnessSync(t *testing.T) {
	ts := setupTestServer(t)
	defer ts.Close()

	userID := "test-user-1"
	token := ts.generateToken(userID)

	req := models.FitnessSyncRequest{
		UserID:        userID,
		CompetitionID: "comp-1",
		Steps:         10000,
		Distance:      8.5,
		Calories:      500,
		Source:        "google_fit",
	}

	body, _ := json.Marshal(req)
	httpReq := httptest.NewRequest("POST", "/api/v1/fitness/sync", bytes.NewBuffer(body))
	httpReq.Header.Set("Authorization", "Bearer "+token)
	httpReq.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	ts.router.ServeHTTP(w, httpReq)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestAPI_ConcurrentRequests(t *testing.T) {
	ts := setupTestServer(t)
	defer ts.Close()

	competitionID := "comp-1"
	numRequests := 50

	done := make(chan bool, numRequests)

	for i := 0; i < numRequests; i++ {
		go func(index int) {
			userID := "user-" + string(rune(index))
			token := ts.generateToken(userID)

			req := models.ScoreUpdateRequest{
				UserID:        userID,
				CompetitionID: competitionID,
				Steps:         int64(index * 1000),
			}

			body, _ := json.Marshal(req)
			httpReq := httptest.NewRequest("POST", "/api/v1/leaderboard/update", bytes.NewBuffer(body))
			httpReq.Header.Set("Authorization", "Bearer "+token)
			httpReq.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			ts.router.ServeHTTP(w, httpReq)

			assert.Equal(t, http.StatusOK, w.Code)
			done <- true
		}(i)
	}

	// Wait for all requests
	for i := 0; i < numRequests; i++ {
		<-done
	}

	// Verify all users are in leaderboard
	token := ts.generateToken("user-1")
	httpReq := httptest.NewRequest("GET", "/api/v1/leaderboard/"+competitionID+"?limit=100", nil)
	httpReq.Header.Set("Authorization", "Bearer "+token)

	w := httptest.NewRecorder()
	ts.router.ServeHTTP(w, httpReq)

	assert.Equal(t, http.StatusOK, w.Code)
}

func BenchmarkAPI_LeaderboardUpdate(b *testing.B) {
	ts := setupTestServer(&testing.T{})
	defer ts.Close()

	userID := "bench-user"
	token := ts.generateToken(userID)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		req := models.ScoreUpdateRequest{
			UserID:        userID,
			CompetitionID: "bench-comp",
			Steps:         int64(i * 100),
		}

		body, _ := json.Marshal(req)
		httpReq := httptest.NewRequest("POST", "/api/v1/leaderboard/update", bytes.NewBuffer(body))
		httpReq.Header.Set("Authorization", "Bearer "+token)
		httpReq.Header.Set("Content-Type", "application/json")

		w := httptest.NewRecorder()
		ts.router.ServeHTTP(w, httpReq)
	}
}
