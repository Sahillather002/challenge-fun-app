package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/yourusername/health-competition-go/internal/models"
	"github.com/yourusername/health-competition-go/internal/services"
	"github.com/yourusername/health-competition-go/pkg/utils"

	"github.com/gorilla/mux"
)

type LeaderboardHandler struct {
	service *services.LeaderboardService
	logger  *utils.Logger
}

func NewLeaderboardHandler(service *services.LeaderboardService, logger *utils.Logger) *LeaderboardHandler {
	return &LeaderboardHandler{
		service: service,
		logger:  logger,
	}
}

// GetLeaderboard handles GET /api/v1/leaderboard/:competitionId
func (h *LeaderboardHandler) GetLeaderboard(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	competitionID := vars["competitionId"]

	// Get limit from query params (default 100)
	limitStr := r.URL.Query().Get("limit")
	limit := 100
	if limitStr != "" {
		if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 {
			limit = parsedLimit
		}
	}

	leaderboard, err := h.service.GetLeaderboard(r.Context(), competitionID, limit)
	if err != nil {
		h.logger.Errorf("Failed to get leaderboard: %v", err)
		h.sendErrorResponse(w, "Failed to retrieve leaderboard", http.StatusInternalServerError)
		return
	}

	h.sendSuccessResponse(w, leaderboard, http.StatusOK)
}

// UpdateScore handles POST /api/v1/leaderboard/update
func (h *LeaderboardHandler) UpdateScore(w http.ResponseWriter, r *http.Request) {
	var req models.ScoreUpdateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate request
	if req.UserID == "" || req.CompetitionID == "" {
		h.sendErrorResponse(w, "User ID and Competition ID are required", http.StatusBadRequest)
		return
	}

	err := h.service.UpdateScore(r.Context(), &req)
	if err != nil {
		h.logger.Errorf("Failed to update score: %v", err)
		h.sendErrorResponse(w, "Failed to update score", http.StatusInternalServerError)
		return
	}

	h.sendSuccessResponse(w, map[string]string{"message": "Score updated successfully"}, http.StatusOK)
}

// CalculatePrizes handles POST /api/v1/prizes/calculate/:competitionId
func (h *LeaderboardHandler) CalculatePrizes(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	competitionID := vars["competitionId"]

	// Get prize pool from request body
	var reqBody struct {
		PrizePool float64 `json:"prize_pool"`
	}
	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		h.sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if reqBody.PrizePool <= 0 {
		h.sendErrorResponse(w, "Prize pool must be greater than 0", http.StatusBadRequest)
		return
	}

	prizes, err := h.service.CalculatePrizes(r.Context(), competitionID, reqBody.PrizePool)
	if err != nil {
		h.logger.Errorf("Failed to calculate prizes: %v", err)
		h.sendErrorResponse(w, "Failed to calculate prizes", http.StatusInternalServerError)
		return
	}

	h.sendSuccessResponse(w, prizes, http.StatusOK)
}

// DistributePrizes handles POST /api/v1/prizes/distribute/:competitionId
func (h *LeaderboardHandler) DistributePrizes(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	competitionID := vars["competitionId"]

	// In a real implementation, this would integrate with payment gateway
	h.logger.Infof("Distributing prizes for competition: %s", competitionID)

	// Mock response
	response := map[string]interface{}{
		"success": true,
		"message": "Prizes distribution initiated",
		"competition_id": competitionID,
	}

	h.sendSuccessResponse(w, response, http.StatusOK)
}

// Helper methods
func (h *LeaderboardHandler) sendSuccessResponse(w http.ResponseWriter, data interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	
	response := models.SuccessResponse{
		Success: true,
		Data:    data,
	}
	
	json.NewEncoder(w).Encode(response)
}

func (h *LeaderboardHandler) sendErrorResponse(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	
	response := models.ErrorResponse{
		Error:   http.StatusText(statusCode),
		Message: message,
		Code:    statusCode,
	}
	
	json.NewEncoder(w).Encode(response)
}
