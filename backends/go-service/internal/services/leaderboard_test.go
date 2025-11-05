package services

import (
	"context"
	"testing"

	"github.com/yourusername/health-competition-go/internal/models"

	"github.com/alicebob/miniredis/v2"
	"github.com/redis/go-redis/v9"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func setupTestRedis(t *testing.T) (*redis.Client, *miniredis.Miniredis) {
	mr, err := miniredis.Run()
	require.NoError(t, err)

	client := redis.NewClient(&redis.Options{
		Addr: mr.Addr(),
	})

	return client, mr
}

func TestLeaderboardService_UpdateScore(t *testing.T) {
	client, mr := setupTestRedis(t)
	defer mr.Close()

	cacheService := NewCacheService(client)
	service := NewLeaderboardService(cacheService, client)

	ctx := context.Background()
	competitionID := "test-comp-1"
	userID := "user-1"

	req := &models.ScoreUpdateRequest{
		UserID:        userID,
		CompetitionID: competitionID,
		Steps:         10000,
		Distance:      8.5,
		Calories:      500,
	}

	err := service.UpdateScore(ctx, req)
	assert.NoError(t, err)

	// Verify score was updated
	leaderboard, err := service.GetLeaderboard(ctx, competitionID, 10)
	assert.NoError(t, err)
	assert.NotNil(t, leaderboard)
	assert.Equal(t, 1, len(leaderboard.Entries))
	assert.Equal(t, userID, leaderboard.Entries[0].UserID)
	assert.Equal(t, int64(10000), leaderboard.Entries[0].Score)
}

func TestLeaderboardService_GetLeaderboard(t *testing.T) {
	client, mr := setupTestRedis(t)
	defer mr.Close()

	cacheService := NewCacheService(client)
	service := NewLeaderboardService(cacheService, client)

	ctx := context.Background()
	competitionID := "test-comp-1"

	// Add multiple users
	users := []struct {
		userID string
		steps  int64
	}{
		{"user-1", 15000},
		{"user-2", 12000},
		{"user-3", 18000},
		{"user-4", 10000},
	}

	for _, u := range users {
		req := &models.ScoreUpdateRequest{
			UserID:        u.userID,
			CompetitionID: competitionID,
			Steps:         u.steps,
			Distance:      float64(u.steps) * 0.0008,
			Calories:      float64(u.steps) / 20,
		}
		err := service.UpdateScore(ctx, req)
		require.NoError(t, err)
	}

	// Get leaderboard
	leaderboard, err := service.GetLeaderboard(ctx, competitionID, 10)
	assert.NoError(t, err)
	assert.NotNil(t, leaderboard)
	assert.Equal(t, 4, len(leaderboard.Entries))

	// Verify order (highest score first)
	assert.Equal(t, "user-3", leaderboard.Entries[0].UserID)
	assert.Equal(t, int64(18000), leaderboard.Entries[0].Score)
	assert.Equal(t, 1, leaderboard.Entries[0].Rank)

	assert.Equal(t, "user-1", leaderboard.Entries[1].UserID)
	assert.Equal(t, int64(15000), leaderboard.Entries[1].Score)
	assert.Equal(t, 2, leaderboard.Entries[1].Rank)
}

func TestLeaderboardService_GetUserRank(t *testing.T) {
	client, mr := setupTestRedis(t)
	defer mr.Close()

	cacheService := NewCacheService(client)
	service := NewLeaderboardService(cacheService, client)

	ctx := context.Background()
	competitionID := "test-comp-1"

	// Add users with different scores
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
		err := service.UpdateScore(ctx, req)
		require.NoError(t, err)
	}

	// Check ranks
	rank1, err := service.GetUserRank(ctx, competitionID, "user-3")
	assert.NoError(t, err)
	assert.Equal(t, 1, rank1)

	rank2, err := service.GetUserRank(ctx, competitionID, "user-1")
	assert.NoError(t, err)
	assert.Equal(t, 2, rank2)

	rank3, err := service.GetUserRank(ctx, competitionID, "user-2")
	assert.NoError(t, err)
	assert.Equal(t, 3, rank3)
}

func TestLeaderboardService_CalculatePrizes(t *testing.T) {
	client, mr := setupTestRedis(t)
	defer mr.Close()

	cacheService := NewCacheService(client)
	service := NewLeaderboardService(cacheService, client)

	ctx := context.Background()
	competitionID := "test-comp-1"
	prizePool := 1000.0

	// Add users
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
		err := service.UpdateScore(ctx, req)
		require.NoError(t, err)
	}

	// Calculate prizes
	prizes, err := service.CalculatePrizes(ctx, competitionID, prizePool)
	assert.NoError(t, err)
	assert.Equal(t, 3, len(prizes))

	// Verify prize distribution (60%, 30%, 10%)
	assert.Equal(t, "user-3", prizes[0].UserID)
	assert.Equal(t, 600.0, prizes[0].Amount)
	assert.Equal(t, 1, prizes[0].Rank)

	assert.Equal(t, "user-1", prizes[1].UserID)
	assert.Equal(t, 300.0, prizes[1].Amount)
	assert.Equal(t, 2, prizes[1].Rank)

	assert.Equal(t, "user-2", prizes[2].UserID)
	assert.Equal(t, 100.0, prizes[2].Amount)
	assert.Equal(t, 3, prizes[2].Rank)
}

func TestLeaderboardService_UpdateScore_Concurrent(t *testing.T) {
	client, mr := setupTestRedis(t)
	defer mr.Close()

	cacheService := NewCacheService(client)
	service := NewLeaderboardService(cacheService, client)

	ctx := context.Background()
	competitionID := "test-comp-1"
	userID := "user-1"

	// Simulate concurrent updates
	done := make(chan bool)
	updates := 10

	for i := 0; i < updates; i++ {
		go func(steps int64) {
			req := &models.ScoreUpdateRequest{
				UserID:        userID,
				CompetitionID: competitionID,
				Steps:         steps,
			}
			err := service.UpdateScore(ctx, req)
			assert.NoError(t, err)
			done <- true
		}(int64(i * 1000))
	}

	// Wait for all updates
	for i := 0; i < updates; i++ {
		<-done
	}

	// Verify final state
	leaderboard, err := service.GetLeaderboard(ctx, competitionID, 10)
	assert.NoError(t, err)
	assert.NotNil(t, leaderboard)
	assert.Equal(t, 1, len(leaderboard.Entries))
}

func BenchmarkLeaderboardService_UpdateScore(b *testing.B) {
	client, mr := setupTestRedis(&testing.T{})
	defer mr.Close()

	cacheService := NewCacheService(client)
	service := NewLeaderboardService(cacheService, client)

	ctx := context.Background()
	competitionID := "bench-comp"

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		req := &models.ScoreUpdateRequest{
			UserID:        "user-" + string(rune(i%100)),
			CompetitionID: competitionID,
			Steps:         int64(i * 100),
		}
		service.UpdateScore(ctx, req)
	}
}

func BenchmarkLeaderboardService_GetLeaderboard(b *testing.B) {
	client, mr := setupTestRedis(&testing.T{})
	defer mr.Close()

	cacheService := NewCacheService(client)
	service := NewLeaderboardService(cacheService, client)

	ctx := context.Background()
	competitionID := "bench-comp"

	// Populate with data
	for i := 0; i < 100; i++ {
		req := &models.ScoreUpdateRequest{
			UserID:        "user-" + string(rune(i)),
			CompetitionID: competitionID,
			Steps:         int64(i * 1000),
		}
		service.UpdateScore(ctx, req)
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		service.GetLeaderboard(ctx, competitionID, 10)
	}
}
