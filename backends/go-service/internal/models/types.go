package models

import "time"

// User represents a user in the system
type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
}

// Competition represents a fitness competition
type Competition struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	EntryFee    float64   `json:"entry_fee"`
	PrizePool   float64   `json:"prize_pool"`
	StartDate   time.Time `json:"start_date"`
	EndDate     time.Time `json:"end_date"`
	Status      string    `json:"status"` // active, upcoming, completed
	Type        string    `json:"type"`   // weekly, monthly
	CreatedAt   time.Time `json:"created_at"`
}

// LeaderboardEntry represents a single entry in the leaderboard
type LeaderboardEntry struct {
	UserID         string    `json:"user_id"`
	UserName       string    `json:"user_name"`
	CompetitionID  string    `json:"competition_id"`
	Score          int64     `json:"score"`
	Rank           int       `json:"rank"`
	Steps          int64     `json:"steps"`
	Distance       float64   `json:"distance"`
	Calories       float64   `json:"calories"`
	LastSyncedAt   time.Time `json:"last_synced_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// Leaderboard represents the full leaderboard for a competition
type Leaderboard struct {
	CompetitionID string              `json:"competition_id"`
	Entries       []LeaderboardEntry  `json:"entries"`
	TotalCount    int                 `json:"total_count"`
	UpdatedAt     time.Time           `json:"updated_at"`
}

// FitnessData represents fitness tracking data from Google Fit or similar
type FitnessData struct {
	ID            string    `json:"id"`
	UserID        string    `json:"user_id"`
	CompetitionID string    `json:"competition_id"`
	Steps         int64     `json:"steps"`
	Distance      float64   `json:"distance"` // in meters
	Calories      float64   `json:"calories"`
	ActiveMinutes int       `json:"active_minutes"`
	Source        string    `json:"source"` // google_fit, apple_health, etc.
	Date          time.Time `json:"date"`
	SyncedAt      time.Time `json:"synced_at"`
	CreatedAt     time.Time `json:"created_at"`
}

// FitnessSyncRequest represents a request to sync fitness data
type FitnessSyncRequest struct {
	UserID        string    `json:"user_id"`
	CompetitionID string    `json:"competition_id"`
	Steps         int64     `json:"steps"`
	Distance      float64   `json:"distance"`
	Calories      float64   `json:"calories"`
	ActiveMinutes int       `json:"active_minutes"`
	Source        string    `json:"source"`
	Date          time.Time `json:"date"`
}

// ScoreUpdateRequest represents a request to update a user's score
type ScoreUpdateRequest struct {
	UserID        string `json:"user_id"`
	CompetitionID string `json:"competition_id"`
	Steps         int64  `json:"steps"`
	Distance      float64 `json:"distance"`
	Calories      float64 `json:"calories"`
}

// Prize represents a prize distribution
type Prize struct {
	ID            string    `json:"id"`
	CompetitionID string    `json:"competition_id"`
	UserID        string    `json:"user_id"`
	Rank          int       `json:"rank"`
	Amount        float64   `json:"amount"`
	Status        string    `json:"status"` // pending, distributed, failed
	DistributedAt *time.Time `json:"distributed_at,omitempty"`
	CreatedAt     time.Time `json:"created_at"`
}

// PrizeDistribution represents the prize distribution configuration
type PrizeDistribution struct {
	Rank1Percentage float64 `json:"rank_1_percentage"` // e.g., 0.60 for 60%
	Rank2Percentage float64 `json:"rank_2_percentage"` // e.g., 0.30 for 30%
	Rank3Percentage float64 `json:"rank_3_percentage"` // e.g., 0.10 for 10%
}

// WebSocketMessage represents a message sent/received via WebSocket
type WebSocketMessage struct {
	Type      string      `json:"type"`
	Data      interface{} `json:"data"`
	Timestamp time.Time   `json:"timestamp"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
	Code    int    `json:"code"`
}

// SuccessResponse represents a success response
type SuccessResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message,omitempty"`
}
