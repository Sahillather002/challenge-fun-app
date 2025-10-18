package services

import (
	"context"
	"fmt"
	"time"

	"github.com/yourusername/health-competition-go/internal/models"

	"github.com/redis/go-redis/v9"
)

type LeaderboardService struct {
	cache       *CacheService
	redisClient *redis.Client
}

func NewLeaderboardService(cache *CacheService, redisClient *redis.Client) *LeaderboardService {
	return &LeaderboardService{
		cache:       cache,
		redisClient: redisClient,
	}
}

// GetLeaderboard retrieves the leaderboard for a competition
func (s *LeaderboardService) GetLeaderboard(ctx context.Context, competitionID string, limit int) (*models.Leaderboard, error) {
	key := s.getLeaderboardKey(competitionID)

	// Get top N entries from sorted set (reverse order - highest scores first)
	entries, err := s.cache.ZRevRangeWithScores(ctx, key, 0, int64(limit-1))
	if err != nil {
		return nil, err
	}

	leaderboardEntries := make([]models.LeaderboardEntry, 0, len(entries))
	for i, entry := range entries {
		userID := entry.Member.(string)
		
		// Get user details from cache
		userDetails, err := s.getUserDetails(ctx, competitionID, userID)
		if err != nil {
			// If user details not found, create minimal entry
			userDetails = &models.LeaderboardEntry{
				UserID: userID,
				UserName: "Unknown",
			}
		}

		leaderboardEntry := models.LeaderboardEntry{
			UserID:        userID,
			UserName:      userDetails.UserName,
			CompetitionID: competitionID,
			Score:         int64(entry.Score),
			Rank:          i + 1,
			Steps:         userDetails.Steps,
			Distance:      userDetails.Distance,
			Calories:      userDetails.Calories,
			LastSyncedAt:  userDetails.LastSyncedAt,
			UpdatedAt:     time.Now(),
		}
		leaderboardEntries = append(leaderboardEntries, leaderboardEntry)
	}

	totalCount, err := s.redisClient.ZCard(ctx, key).Result()
	if err != nil {
		totalCount = int64(len(entries))
	}

	return &models.Leaderboard{
		CompetitionID: competitionID,
		Entries:       leaderboardEntries,
		TotalCount:    int(totalCount),
		UpdatedAt:     time.Now(),
	}, nil
}

// UpdateScore updates a user's score in the leaderboard
func (s *LeaderboardService) UpdateScore(ctx context.Context, req *models.ScoreUpdateRequest) error {
	key := s.getLeaderboardKey(req.CompetitionID)

	// Calculate total score (you can customize this formula)
	score := float64(req.Steps)

	// Update score in sorted set
	err := s.cache.ZAdd(ctx, key, score, req.UserID)
	if err != nil {
		return err
	}

	// Store detailed user data
	userDetailsKey := s.getUserDetailsKey(req.CompetitionID, req.UserID)
	userDetails := &models.LeaderboardEntry{
		UserID:        req.UserID,
		CompetitionID: req.CompetitionID,
		Score:         int64(score),
		Steps:         req.Steps,
		Distance:      req.Distance,
		Calories:      req.Calories,
		LastSyncedAt:  time.Now(),
		UpdatedAt:     time.Now(),
	}

	err = s.cache.Set(ctx, userDetailsKey, userDetails, 24*time.Hour)
	if err != nil {
		return err
	}

	// Publish update to Redis pub/sub for WebSocket broadcasting
	s.publishLeaderboardUpdate(ctx, req.CompetitionID, req.UserID, int64(score))

	return nil
}

// GetUserRank gets the rank of a specific user
func (s *LeaderboardService) GetUserRank(ctx context.Context, competitionID, userID string) (int, error) {
	key := s.getLeaderboardKey(competitionID)
	
	// Get reverse rank (0-based), add 1 to make it 1-based
	rank, err := s.cache.ZRevRank(ctx, key, userID)
	if err != nil {
		return 0, err
	}

	return int(rank) + 1, nil
}

// CalculatePrizes calculates prize distribution for a competition
func (s *LeaderboardService) CalculatePrizes(ctx context.Context, competitionID string, prizePool float64) ([]models.Prize, error) {
	// Get top 3 winners
	leaderboard, err := s.GetLeaderboard(ctx, competitionID, 3)
	if err != nil {
		return nil, err
	}

	if len(leaderboard.Entries) == 0 {
		return nil, fmt.Errorf("no participants in competition")
	}

	// Prize distribution: 60%, 30%, 10%
	distribution := models.PrizeDistribution{
		Rank1Percentage: 0.60,
		Rank2Percentage: 0.30,
		Rank3Percentage: 0.10,
	}

	prizes := make([]models.Prize, 0)

	// Rank 1
	if len(leaderboard.Entries) > 0 {
		prizes = append(prizes, models.Prize{
			ID:            fmt.Sprintf("prize-%s-1", competitionID),
			CompetitionID: competitionID,
			UserID:        leaderboard.Entries[0].UserID,
			Rank:          1,
			Amount:        prizePool * distribution.Rank1Percentage,
			Status:        "pending",
			CreatedAt:     time.Now(),
		})
	}

	// Rank 2
	if len(leaderboard.Entries) > 1 {
		prizes = append(prizes, models.Prize{
			ID:            fmt.Sprintf("prize-%s-2", competitionID),
			CompetitionID: competitionID,
			UserID:        leaderboard.Entries[1].UserID,
			Rank:          2,
			Amount:        prizePool * distribution.Rank2Percentage,
			Status:        "pending",
			CreatedAt:     time.Now(),
		})
	}

	// Rank 3
	if len(leaderboard.Entries) > 2 {
		prizes = append(prizes, models.Prize{
			ID:            fmt.Sprintf("prize-%s-3", competitionID),
			CompetitionID: competitionID,
			UserID:        leaderboard.Entries[2].UserID,
			Rank:          3,
			Amount:        prizePool * distribution.Rank3Percentage,
			Status:        "pending",
			CreatedAt:     time.Now(),
		})
	}

	// Cache prizes
	prizesKey := s.getPrizesKey(competitionID)
	s.cache.Set(ctx, prizesKey, prizes, 7*24*time.Hour)

	return prizes, nil
}

// Helper methods
func (s *LeaderboardService) getLeaderboardKey(competitionID string) string {
	return fmt.Sprintf("leaderboard:%s", competitionID)
}

func (s *LeaderboardService) getUserDetailsKey(competitionID, userID string) string {
	return fmt.Sprintf("user_details:%s:%s", competitionID, userID)
}

func (s *LeaderboardService) getPrizesKey(competitionID string) string {
	return fmt.Sprintf("prizes:%s", competitionID)
}

func (s *LeaderboardService) getUserDetails(ctx context.Context, competitionID, userID string) (*models.LeaderboardEntry, error) {
	key := s.getUserDetailsKey(competitionID, userID)
	var details models.LeaderboardEntry
	err := s.cache.Get(ctx, key, &details)
	if err != nil {
		return nil, err
	}
	return &details, nil
}

func (s *LeaderboardService) publishLeaderboardUpdate(ctx context.Context, competitionID, userID string, score int64) {
	channel := fmt.Sprintf("leaderboard:%s", competitionID)
	message := map[string]interface{}{
		"type":           "score_update",
		"competition_id": competitionID,
		"user_id":        userID,
		"score":          score,
		"timestamp":      time.Now(),
	}
	s.cache.Publish(ctx, channel, message)
}
