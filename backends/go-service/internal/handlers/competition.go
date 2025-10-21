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

type CompetitionHandler struct {
	service *services.CompetitionService
	logger  *utils.Logger
}

func NewCompetitionHandler(service *services.CompetitionService, logger *utils.Logger) *CompetitionHandler {
	return &CompetitionHandler{
		service: service,
		logger:  logger,
	}
}

// GetCompetitions handles GET /api/v1/competitions
func (h *CompetitionHandler) GetCompetitions(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status") // active, upcoming, completed, all
	if status == "" {
		status = "all"
	}

	limitStr := r.URL.Query().Get("limit")
	limit := 50
	if limitStr != "" {
		if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 {
			limit = parsedLimit
		}
	}

	offsetStr := r.URL.Query().Get("offset")
	offset := 0
	if offsetStr != "" {
		if parsedOffset, err := strconv.Atoi(offsetStr); err == nil && parsedOffset >= 0 {
			offset = parsedOffset
		}
	}

	competitions, err := h.service.GetCompetitions(r.Context(), status, limit, offset)
	if err != nil {
		h.logger.Errorf("Failed to get competitions: %v", err)
		h.sendErrorResponse(w, "Failed to retrieve competitions", http.StatusInternalServerError)
		return
	}

	h.sendSuccessResponse(w, competitions, http.StatusOK)
}

// GetCompetition handles GET /api/v1/competitions/:id
func (h *CompetitionHandler) GetCompetition(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	competitionID := vars["id"]

	competition, err := h.service.GetCompetitionByID(r.Context(), competitionID)
	if err != nil {
		h.logger.Errorf("Failed to get competition: %v", err)
		h.sendErrorResponse(w, "Competition not found", http.StatusNotFound)
		return
	}

	h.sendSuccessResponse(w, competition, http.StatusOK)
}

// CreateCompetition handles POST /api/v1/competitions
func (h *CompetitionHandler) CreateCompetition(w http.ResponseWriter, r *http.Request) {
	var req models.CreateCompetitionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate request
	if req.Name == "" || req.StartDate.IsZero() || req.EndDate.IsZero() {
		h.sendErrorResponse(w, "Name, start date, and end date are required", http.StatusBadRequest)
		return
	}

	// Get user ID from context (set by auth middleware)
	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		h.sendErrorResponse(w, "User ID not found", http.StatusUnauthorized)
		return
	}
	req.CreatorID = userID

	competition, err := h.service.CreateCompetition(r.Context(), &req)
	if err != nil {
		h.logger.Errorf("Failed to create competition: %v", err)
		h.sendErrorResponse(w, "Failed to create competition", http.StatusInternalServerError)
		return
	}

	h.sendSuccessResponse(w, competition, http.StatusCreated)
}

// JoinCompetition handles POST /api/v1/competitions/:id/join
func (h *CompetitionHandler) JoinCompetition(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	competitionID := vars["id"]

	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		h.sendErrorResponse(w, "User ID not found", http.StatusUnauthorized)
		return
	}

	err := h.service.JoinCompetition(r.Context(), competitionID, userID)
	if err != nil {
		h.logger.Errorf("Failed to join competition: %v", err)
		h.sendErrorResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	h.sendSuccessResponse(w, map[string]string{"message": "Successfully joined competition"}, http.StatusOK)
}

// GetUserCompetitions handles GET /api/v1/users/:userId/competitions
func (h *CompetitionHandler) GetUserCompetitions(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["userId"]

	status := r.URL.Query().Get("status")
	if status == "" {
		status = "all"
	}

	competitions, err := h.service.GetUserCompetitions(r.Context(), userID, status)
	if err != nil {
		h.logger.Errorf("Failed to get user competitions: %v", err)
		h.sendErrorResponse(w, "Failed to retrieve user competitions", http.StatusInternalServerError)
		return
	}

	h.sendSuccessResponse(w, competitions, http.StatusOK)
}

// Helper methods
func (h *CompetitionHandler) sendSuccessResponse(w http.ResponseWriter, data interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	response := models.SuccessResponse{
		Success: true,
		Data:    data,
	}

	json.NewEncoder(w).Encode(response)
}

func (h *CompetitionHandler) sendErrorResponse(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	response := models.ErrorResponse{
		Error:   http.StatusText(statusCode),
		Message: message,
		Code:    statusCode,
	}

	json.NewEncoder(w).Encode(response)
}
