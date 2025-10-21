package services

import (
	"context"
	"fmt"
	"time"

	"github.com/yourusername/health-competition-go/internal/models"
)

type FitnessService struct {
	cache       *CacheService
	supabaseURL string
}

func NewFitnessService(cache *CacheService, supabaseURL string) *FitnessService {
	return &FitnessService{
		cache:       cache,
		supabaseURL: supabaseURL,
	}
}

// SyncFitnessData syncs fitness data from external sources
func (s *FitnessService) SyncFitnessData(ctx context.Context, req *models.FitnessSyncRequest) error {
	// Store fitness data in cache
	fitnessKey := s.getFitnessDataKey(req.UserID, req.CompetitionID, req.Date)
	
	fitnessData := &models.FitnessData{
		ID:            fmt.Sprintf("%s-%s-%d", req.UserID, req.CompetitionID, req.Date.Unix()),
		UserID:        req.UserID,
		CompetitionID: req.CompetitionID,
		Steps:         req.Steps,
		Distance:      req.Distance,
		Calories:      req.Calories,
		ActiveMinutes: req.ActiveMinutes,
		Source:        req.Source,
		Date:          req.Date,
		SyncedAt:      time.Now(),
		CreatedAt:     time.Now(),
	}

	err := s.cache.Set(ctx, fitnessKey, fitnessData, 30*24*time.Hour)
	if err != nil {
		return err
	}

	// Update aggregated stats
	err = s.updateAggregatedStats(ctx, req.UserID, req.CompetitionID, fitnessData)
	if err != nil {
		return err
	}

	return nil
}

// GetUserStats retrieves aggregated fitness statistics for a user
func (s *FitnessService) GetUserStats(ctx context.Context, userID, competitionID string) (*models.FitnessData, error) {
	statsKey := s.getUserStatsKey(userID, competitionID)
	
	var stats models.FitnessData
	err := s.cache.Get(ctx, statsKey, &stats)
	if err != nil {
		// Return zero stats if not found
		return &models.FitnessData{
			UserID:        userID,
			CompetitionID: competitionID,
			Steps:         0,
			Distance:      0,
			Calories:      0,
			ActiveMinutes: 0,
		}, nil
	}

	return &stats, nil
}

// updateAggregatedStats updates the aggregated statistics for a user in a competition
func (s *FitnessService) updateAggregatedStats(ctx context.Context, userID, competitionID string, newData *models.FitnessData) error {
	statsKey := s.getUserStatsKey(userID, competitionID)

	// Get current stats
	var currentStats models.FitnessData
	err := s.cache.Get(ctx, statsKey, &currentStats)
	if err != nil {
		// Initialize if not exists
		currentStats = models.FitnessData{
			UserID:        userID,
			CompetitionID: competitionID,
			Steps:         0,
			Distance:      0,
			Calories:      0,
			ActiveMinutes: 0,
		}
	}

	// Update aggregated values
	currentStats.Steps += newData.Steps
	currentStats.Distance += newData.Distance
	currentStats.Calories += newData.Calories
	currentStats.ActiveMinutes += newData.ActiveMinutes
	currentStats.Source = newData.Source

	// Save updated stats
	err = s.cache.Set(ctx, statsKey, currentStats, 30*24*time.Hour)
	if err != nil {
		return err
	}

	return nil
}

// GetDailyStats retrieves fitness data for a specific day
func (s *FitnessService) GetDailyStats(ctx context.Context, userID, competitionID string, date time.Time) (*models.FitnessData, error) {
	fitnessKey := s.getFitnessDataKey(userID, competitionID, date)
	
	var fitnessData models.FitnessData
	err := s.cache.Get(ctx, fitnessKey, &fitnessData)
	if err != nil {
		return nil, err
	}

	return &fitnessData, nil
}

// Helper methods
func (s *FitnessService) getFitnessDataKey(userID, competitionID string, date time.Time) string {
	dateStr := date.Format("2006-01-02")
	return fmt.Sprintf("fitness:%s:%s:%s", userID, competitionID, dateStr)
}

func (s *FitnessService) getUserStatsKey(userID, competitionID string) string {
	return fmt.Sprintf("fitness_stats:%s:%s", userID, competitionID)
}
