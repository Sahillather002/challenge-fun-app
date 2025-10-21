package services

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/yourusername/health-competition-go/internal/models"
	"github.com/google/uuid"
)

type CompetitionService struct {
	db    *sql.DB
	cache *CacheService
}

func NewCompetitionService(db *sql.DB, cache *CacheService) *CompetitionService {
	return &CompetitionService{
		db:    db,
		cache: cache,
	}
}

// GetCompetitions retrieves competitions based on status filter
func (s *CompetitionService) GetCompetitions(ctx context.Context, status string, limit, offset int) ([]models.Competition, error) {
	query := `
		SELECT id, name, description, entry_fee, prize_pool, start_date, end_date, status, type, created_at
		FROM competitions
		WHERE 1=1
	`
	
	args := []interface{}{}
	argPos := 1

	if status != "all" {
		query += fmt.Sprintf(" AND status = $%d", argPos)
		args = append(args, status)
		argPos++
	}

	query += fmt.Sprintf(" ORDER BY created_at DESC LIMIT $%d OFFSET $%d", argPos, argPos+1)
	args = append(args, limit, offset)

	rows, err := s.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query competitions: %w", err)
	}
	defer rows.Close()

	var competitions []models.Competition
	for rows.Next() {
		var comp models.Competition
		if err := rows.Scan(
			&comp.ID, &comp.Name, &comp.Description, &comp.EntryFee, &comp.PrizePool,
			&comp.StartDate, &comp.EndDate, &comp.Status, &comp.Type, &comp.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan competition: %w", err)
		}
		competitions = append(competitions, comp)
	}

	return competitions, nil
}

// GetCompetitionByID retrieves a single competition by ID
func (s *CompetitionService) GetCompetitionByID(ctx context.Context, id string) (*models.Competition, error) {
	query := `
		SELECT id, name, description, entry_fee, prize_pool, start_date, end_date, status, type, created_at
		FROM competitions
		WHERE id = $1
	`

	var comp models.Competition
	err := s.db.QueryRowContext(ctx, query, id).Scan(
		&comp.ID, &comp.Name, &comp.Description, &comp.EntryFee, &comp.PrizePool,
		&comp.StartDate, &comp.EndDate, &comp.Status, &comp.Type, &comp.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("competition not found")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get competition: %w", err)
	}

	return &comp, nil
}

// CreateCompetition creates a new competition
func (s *CompetitionService) CreateCompetition(ctx context.Context, req *models.CreateCompetitionRequest) (*models.Competition, error) {
	// Validate dates
	if req.StartDate.After(req.EndDate) {
		return nil, fmt.Errorf("start date must be before end date")
	}

	// Determine status based on dates
	now := time.Now()
	status := "upcoming"
	if now.After(req.StartDate) && now.Before(req.EndDate) {
		status = "active"
	} else if now.After(req.EndDate) {
		status = "completed"
	}

	comp := &models.Competition{
		ID:          uuid.New().String(),
		Name:        req.Name,
		Description: req.Description,
		EntryFee:    req.EntryFee,
		PrizePool:   req.PrizePool,
		StartDate:   req.StartDate,
		EndDate:     req.EndDate,
		Status:      status,
		Type:        req.Type,
		CreatedAt:   time.Now(),
	}

	query := `
		INSERT INTO competitions (id, name, description, entry_fee, prize_pool, start_date, end_date, status, type, created_at, creator_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
	`

	_, err := s.db.ExecContext(ctx, query,
		comp.ID, comp.Name, comp.Description, comp.EntryFee, comp.PrizePool,
		comp.StartDate, comp.EndDate, comp.Status, comp.Type, comp.CreatedAt, req.CreatorID,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create competition: %w", err)
	}

	return comp, nil
}

// JoinCompetition allows a user to join a competition
func (s *CompetitionService) JoinCompetition(ctx context.Context, competitionID, userID string) error {
	// Check if competition exists and is active/upcoming
	comp, err := s.GetCompetitionByID(ctx, competitionID)
	if err != nil {
		return err
	}

	if comp.Status == "completed" {
		return fmt.Errorf("cannot join a completed competition")
	}

	// Check if user already joined
	var exists bool
	checkQuery := `SELECT EXISTS(SELECT 1 FROM competition_participants WHERE competition_id = $1 AND user_id = $2)`
	if err := s.db.QueryRowContext(ctx, checkQuery, competitionID, userID).Scan(&exists); err != nil {
		return fmt.Errorf("failed to check participation: %w", err)
	}

	if exists {
		return fmt.Errorf("user already joined this competition")
	}

	// Insert participation record
	insertQuery := `
		INSERT INTO competition_participants (id, competition_id, user_id, joined_at)
		VALUES ($1, $2, $3, $4)
	`

	_, err = s.db.ExecContext(ctx, insertQuery, uuid.New().String(), competitionID, userID, time.Now())
	if err != nil {
		return fmt.Errorf("failed to join competition: %w", err)
	}

	return nil
}

// GetUserCompetitions retrieves competitions that a user has joined
func (s *CompetitionService) GetUserCompetitions(ctx context.Context, userID, status string) ([]models.UserCompetition, error) {
	query := `
		SELECT 
			c.id, c.name, c.description, c.entry_fee, c.prize_pool,
			c.start_date, c.end_date, c.status, c.type, c.created_at,
			cp.joined_at,
			COALESCE(SUM(fd.steps), 0) as user_steps,
			COALESCE(SUM(fd.calories), 0) as user_calories,
			COALESCE(SUM(fd.distance), 0) as user_distance
		FROM competitions c
		INNER JOIN competition_participants cp ON c.id = cp.competition_id
		LEFT JOIN fitness_data fd ON fd.competition_id = c.id AND fd.user_id = cp.user_id
		WHERE cp.user_id = $1
	`

	args := []interface{}{userID}
	argPos := 2

	if status != "all" {
		query += fmt.Sprintf(" AND c.status = $%d", argPos)
		args = append(args, status)
		argPos++
	}

	query += ` GROUP BY c.id, c.name, c.description, c.entry_fee, c.prize_pool, c.start_date, c.end_date, c.status, c.type, c.created_at, cp.joined_at ORDER BY c.created_at DESC`

	rows, err := s.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query user competitions: %w", err)
	}
	defer rows.Close()

	var competitions []models.UserCompetition
	for rows.Next() {
		var uc models.UserCompetition
		if err := rows.Scan(
			&uc.ID, &uc.Name, &uc.Description, &uc.EntryFee, &uc.PrizePool,
			&uc.StartDate, &uc.EndDate, &uc.Status, &uc.Type, &uc.CreatedAt,
			&uc.JoinedAt, &uc.UserSteps, &uc.UserCalories, &uc.UserDistance,
		); err != nil {
			return nil, fmt.Errorf("failed to scan user competition: %w", err)
		}
		competitions = append(competitions, uc)
	}

	return competitions, nil
}
