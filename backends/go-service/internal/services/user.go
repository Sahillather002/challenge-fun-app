package services

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/yourusername/health-competition-go/internal/models"
)

type UserService struct {
	db    *sql.DB
	cache *CacheService
}

func NewUserService(db *sql.DB, cache *CacheService) *UserService {
	return &UserService{
		db:    db,
		cache: cache,
	}
}

// GetDashboardStats retrieves comprehensive dashboard statistics for a user
func (s *UserService) GetDashboardStats(ctx context.Context, userID string) (*models.DashboardStats, error) {
	stats := &models.DashboardStats{}

	// Get total stats
	query := `
		SELECT 
			COALESCE(SUM(steps), 0) as total_steps,
			COALESCE(SUM(calories), 0) as total_calories,
			COALESCE(SUM(distance), 0) as total_distance
		FROM fitness_data
		WHERE user_id = $1
	`
	
	if err := s.db.QueryRowContext(ctx, query, userID).Scan(
		&stats.TotalSteps, &stats.TotalCalories, &stats.TotalDistance,
	); err != nil && err != sql.ErrNoRows {
		return nil, fmt.Errorf("failed to get total stats: %w", err)
	}

	// Get active competitions count
	countQuery := `
		SELECT COUNT(*)
		FROM competition_participants cp
		INNER JOIN competitions c ON cp.competition_id = c.id
		WHERE cp.user_id = $1 AND c.status = 'active'
	`
	
	if err := s.db.QueryRowContext(ctx, countQuery, userID).Scan(&stats.ActiveCompetitions); err != nil {
		return nil, fmt.Errorf("failed to get active competitions count: %w", err)
	}

	// Get best rank
	rankQuery := `
		SELECT COALESCE(MIN(rank), 0)
		FROM leaderboard_entries
		WHERE user_id = $1
	`
	
	if err := s.db.QueryRowContext(ctx, rankQuery, userID).Scan(&stats.BestRank); err != nil && err != sql.ErrNoRows {
		stats.BestRank = 0
	}

	// Get weekly activity (last 7 days)
	weeklyQuery := `
		SELECT 
			DATE(date) as activity_date,
			COALESCE(SUM(steps), 0) as steps,
			COALESCE(SUM(calories), 0) as calories,
			COALESCE(SUM(distance), 0) as distance
		FROM fitness_data
		WHERE user_id = $1 AND date >= NOW() - INTERVAL '7 days'
		GROUP BY DATE(date)
		ORDER BY activity_date DESC
	`
	
	rows, err := s.db.QueryContext(ctx, weeklyQuery, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get weekly activity: %w", err)
	}
	defer rows.Close()

	weeklyActivity := []models.DailyActivity{}
	for rows.Next() {
		var activity models.DailyActivity
		if err := rows.Scan(&activity.Date, &activity.Steps, &activity.Calories, &activity.Distance); err != nil {
			return nil, fmt.Errorf("failed to scan daily activity: %w", err)
		}
		weeklyActivity = append(weeklyActivity, activity)
	}
	stats.WeeklyActivity = weeklyActivity

	// Get recent activity logs (last 10)
	activityQuery := `
		SELECT id, user_id, title, type, steps, calories, distance, duration, created_at
		FROM activity_logs
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT 10
	`
	
	activityRows, err := s.db.QueryContext(ctx, activityQuery, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get recent activity: %w", err)
	}
	defer activityRows.Close()

	recentActivity := []models.ActivityLog{}
	for activityRows.Next() {
		var log models.ActivityLog
		if err := activityRows.Scan(
			&log.ID, &log.UserID, &log.Title, &log.Type,
			&log.Steps, &log.Calories, &log.Distance, &log.Duration, &log.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan activity log: %w", err)
		}
		recentActivity = append(recentActivity, log)
	}
	stats.RecentActivity = recentActivity

	// Calculate percentage changes (comparing last week to previous week)
	var lastWeekSteps, prevWeekSteps int64
	var lastWeekCalories, prevWeekCalories float64

	changeQuery := `
		SELECT 
			COALESCE(SUM(CASE WHEN date >= NOW() - INTERVAL '7 days' THEN steps ELSE 0 END), 0) as last_week_steps,
			COALESCE(SUM(CASE WHEN date >= NOW() - INTERVAL '14 days' AND date < NOW() - INTERVAL '7 days' THEN steps ELSE 0 END), 0) as prev_week_steps,
			COALESCE(SUM(CASE WHEN date >= NOW() - INTERVAL '7 days' THEN calories ELSE 0 END), 0) as last_week_calories,
			COALESCE(SUM(CASE WHEN date >= NOW() - INTERVAL '14 days' AND date < NOW() - INTERVAL '7 days' THEN calories ELSE 0 END), 0) as prev_week_calories
		FROM fitness_data
		WHERE user_id = $1
	`
	
	if err := s.db.QueryRowContext(ctx, changeQuery, userID).Scan(
		&lastWeekSteps, &prevWeekSteps, &lastWeekCalories, &prevWeekCalories,
	); err == nil {
		if prevWeekSteps > 0 {
			stats.StepsChange = float64(lastWeekSteps-prevWeekSteps) / float64(prevWeekSteps) * 100
		}
		if prevWeekCalories > 0 {
			stats.CaloriesChange = (lastWeekCalories - prevWeekCalories) / prevWeekCalories * 100
		}
	}

	return stats, nil
}

// GetUserProfile retrieves user profile information
func (s *UserService) GetUserProfile(ctx context.Context, userID string) (*models.UserProfile, error) {
	// First check if user exists in our custom users table
	existsQuery := `SELECT COUNT(*) FROM users WHERE id = $1`
	var count int
	err := s.db.QueryRowContext(ctx, existsQuery, userID).Scan(&count)
	if err != nil {
		return nil, fmt.Errorf("failed to check user existence: %w", err)
	}

	if count == 0 {
		// User doesn't exist in custom table yet - return basic profile
		return &models.UserProfile{
			ID:        userID,
			Email:     "", // We don't have this from auth.users directly
			Name:      "User", // Default name
			Avatar:    "",
			Bio:       "",
			Country:   "",
			JoinedAt:  time.Now(),
			UpdatedAt: time.Now(),
			TotalSteps: 0,
			TotalCalories: 0,
			TotalDistance: 0,
			CompetitionsWon: 0,
			TotalPrizes: 0,
		}, nil
	}

	// User exists in custom table - get full profile
	query := `
		SELECT
			u.id, u.email, u.name,
			COALESCE(u.avatar, '') as avatar,
			COALESCE(u.bio, '') as bio,
			COALESCE(u.country, '') as country,
			u.created_at, u.updated_at,
			COALESCE(SUM(fd.steps), 0) as total_steps,
			COALESCE(SUM(fd.calories), 0) as total_calories,
			COALESCE(SUM(fd.distance), 0) as total_distance,
			COUNT(DISTINCT CASE WHEN c.status = 'completed' AND le.rank = 1 THEN c.id END) as competitions_won,
			COALESCE(SUM(p.amount), 0) as total_prizes
		FROM users u
		LEFT JOIN fitness_data fd ON fd.user_id = u.id
		LEFT JOIN competition_participants cp ON cp.user_id = u.id
		LEFT JOIN competitions c ON c.id = cp.competition_id
		LEFT JOIN leaderboard_entries le ON le.user_id = u.id AND le.competition_id = c.id
		LEFT JOIN prizes p ON p.user_id = u.id AND p.status = 'distributed'
		WHERE u.id = $1
		GROUP BY u.id, u.email, u.name, u.avatar, u.bio, u.country, u.created_at, u.updated_at
	`

	var profile models.UserProfile
	err = s.db.QueryRowContext(ctx, query, userID).Scan(
		&profile.ID, &profile.Email, &profile.Name,
		&profile.Avatar, &profile.Bio, &profile.Country,
		&profile.JoinedAt, &profile.UpdatedAt,
		&profile.TotalSteps, &profile.TotalCalories, &profile.TotalDistance,
		&profile.CompetitionsWon, &profile.TotalPrizes,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to get user profile: %w", err)
	}

	return &profile, nil
}

// UpdateUserProfile updates user profile information
func (s *UserService) UpdateUserProfile(ctx context.Context, userID string, req *models.UpdateProfileRequest) (*models.UserProfile, error) {
	query := `
		UPDATE users
		SET 
			name = COALESCE(NULLIF($1, ''), name),
			avatar = COALESCE(NULLIF($2, ''), avatar),
			bio = COALESCE(NULLIF($3, ''), bio),
			country = COALESCE(NULLIF($4, ''), country),
			updated_at = $5
		WHERE id = $6
	`

	_, err := s.db.ExecContext(ctx, query,
		req.Name, req.Avatar, req.Bio, req.Country, time.Now(), userID,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to update profile: %w", err)
	}

	return s.GetUserProfile(ctx, userID)
}

// GetUserActivity retrieves user activity for the specified number of days
func (s *UserService) GetUserActivity(ctx context.Context, userID string, days int) ([]models.DailyActivity, error) {
	query := `
		SELECT 
			DATE(date) as activity_date,
			COALESCE(SUM(steps), 0) as steps,
			COALESCE(SUM(calories), 0) as calories,
			COALESCE(SUM(distance), 0) as distance
		FROM fitness_data
		WHERE user_id = $1 AND date >= NOW() - INTERVAL '$2 days'
		GROUP BY DATE(date)
		ORDER BY activity_date DESC
	`

	rows, err := s.db.QueryContext(ctx, query, userID, days)
	if err != nil {
		return nil, fmt.Errorf("failed to get user activity: %w", err)
	}
	defer rows.Close()

	var activities []models.DailyActivity
	for rows.Next() {
		var activity models.DailyActivity
		if err := rows.Scan(&activity.Date, &activity.Steps, &activity.Calories, &activity.Distance); err != nil {
			return nil, fmt.Errorf("failed to scan activity: %w", err)
		}
		activities = append(activities, activity)
	}

	return activities, nil
}

// GetUserTransactions retrieves user transactions
func (s *UserService) GetUserTransactions(ctx context.Context, userID string) ([]models.Transaction, error) {
	query := `
		SELECT id, user_id, competition_id, type, amount, status, description, payment_method, transaction_ref, created_at, completed_at
		FROM transactions
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT 50
	`

	rows, err := s.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get transactions: %w", err)
	}
	defer rows.Close()

	var transactions []models.Transaction
	for rows.Next() {
		var t models.Transaction
		var competitionID sql.NullString
		var transactionRef sql.NullString
		
		if err := rows.Scan(
			&t.ID, &t.UserID, &competitionID, &t.Type, &t.Amount,
			&t.Status, &t.Description, &t.PaymentMethod, &transactionRef,
			&t.CreatedAt, &t.CompletedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan transaction: %w", err)
		}

		if competitionID.Valid {
			t.CompetitionID = competitionID.String
		}
		if transactionRef.Valid {
			t.TransactionRef = transactionRef.String
		}
		
		transactions = append(transactions, t)
	}

	return transactions, nil
}
