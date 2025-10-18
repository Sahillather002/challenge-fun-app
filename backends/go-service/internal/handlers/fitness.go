package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/yourusername/health-competition-go/internal/models"
	"github.com/yourusername/health-competition-go/internal/services"
	"github.com/yourusername/health-competition-go/pkg/utils"

	"github.com/gorilla/mux"
)

type FitnessHandler struct {
	service *services.FitnessService
	logger  *utils.Logger
}

func NewFitnessHandler(service *services.FitnessService, logger *utils.Logger) *FitnessHandler {
	return &FitnessHandler{
		service: service,
		logger:  logger,
	}
}

// SyncFitnessData handles POST /api/v1/fitness/sync
func (h *FitnessHandler) SyncFitnessData(w http.ResponseWriter, r *http.Request) {
	var req models.FitnessSyncRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate request
	if req.UserID == "" || req.CompetitionID == "" {
		h.sendErrorResponse(w, "User ID and Competition ID are required", http.StatusBadRequest)
		return
	}

	if req.Source == "" {
		req.Source = "google_fit"
	}

	err := h.service.SyncFitnessData(r.Context(), &req)
	if err != nil {
		h.logger.Errorf("Failed to sync fitness data: %v", err)
		h.sendErrorResponse(w, "Failed to sync fitness data", http.StatusInternalServerError)
		return
	}

	h.sendSuccessResponse(w, map[string]string{"message": "Fitness data synced successfully"}, http.StatusOK)
}

// GetUserStats handles GET /api/v1/fitness/stats/:userId
func (h *FitnessHandler) GetUserStats(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["userId"]

	competitionID := r.URL.Query().Get("competition_id")
	if competitionID == "" {
		h.sendErrorResponse(w, "Competition ID is required", http.StatusBadRequest)
		return
	}

	stats, err := h.service.GetUserStats(r.Context(), userID, competitionID)
	if err != nil {
		h.logger.Errorf("Failed to get user stats: %v", err)
		h.sendErrorResponse(w, "Failed to retrieve user statistics", http.StatusInternalServerError)
		return
	}

	h.sendSuccessResponse(w, stats, http.StatusOK)
}

// Helper methods
func (h *FitnessHandler) sendSuccessResponse(w http.ResponseWriter, data interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	
	response := models.SuccessResponse{
		Success: true,
		Data:    data,
	}
	
	json.NewEncoder(w).Encode(response)
}

func (h *FitnessHandler) sendErrorResponse(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	
	response := models.ErrorResponse{
		Error:   http.StatusText(statusCode),
		Message: message,
		Code:    statusCode,
	}
	
	json.NewEncoder(w).Encode(response)
}
