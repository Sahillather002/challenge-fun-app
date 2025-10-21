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

type UserHandler struct {
	service *services.UserService
	logger  *utils.Logger
}

func NewUserHandler(service *services.UserService, logger *utils.Logger) *UserHandler {
	return &UserHandler{
		service: service,
		logger:  logger,
	}
}

// GetDashboardStats handles GET /api/v1/users/:userId/dashboard
func (h *UserHandler) GetDashboardStats(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["userId"]

	stats, err := h.service.GetDashboardStats(r.Context(), userID)
	if err != nil {
		h.logger.Errorf("Failed to get dashboard stats: %v", err)
		h.sendErrorResponse(w, "Failed to retrieve dashboard stats", http.StatusInternalServerError)
		return
	}

	h.sendSuccessResponse(w, stats, http.StatusOK)
}

// GetUserProfile handles GET /api/v1/users/:userId/profile
func (h *UserHandler) GetUserProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["userId"]

	profile, err := h.service.GetUserProfile(r.Context(), userID)
	if err != nil {
		h.logger.Errorf("Failed to get user profile: %v", err)
		h.sendErrorResponse(w, "Failed to retrieve user profile", http.StatusNotFound)
		return
	}

	h.sendSuccessResponse(w, profile, http.StatusOK)
}

// UpdateUserProfile handles PUT /api/v1/users/:userId/profile
func (h *UserHandler) UpdateUserProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["userId"]

	var req models.UpdateProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.sendErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	profile, err := h.service.UpdateUserProfile(r.Context(), userID, &req)
	if err != nil {
		h.logger.Errorf("Failed to update user profile: %v", err)
		h.sendErrorResponse(w, "Failed to update profile", http.StatusInternalServerError)
		return
	}

	h.sendSuccessResponse(w, profile, http.StatusOK)
}

// GetUserActivity handles GET /api/v1/users/:userId/activity
func (h *UserHandler) GetUserActivity(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["userId"]

	days := 7 // default last 7 days
	if daysParam := r.URL.Query().Get("days"); daysParam != "" {
		if parsed, err := strconv.Atoi(daysParam); err == nil && parsed > 0 {
			days = parsed
		}
	}

	activity, err := h.service.GetUserActivity(r.Context(), userID, days)
	if err != nil {
		h.logger.Errorf("Failed to get user activity: %v", err)
		h.sendErrorResponse(w, "Failed to retrieve user activity", http.StatusInternalServerError)
		return
	}

	h.sendSuccessResponse(w, activity, http.StatusOK)
}

// GetUserTransactions handles GET /api/v1/users/:userId/transactions
func (h *UserHandler) GetUserTransactions(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["userId"]

	transactions, err := h.service.GetUserTransactions(r.Context(), userID)
	if err != nil {
		h.logger.Errorf("Failed to get user transactions: %v", err)
		h.sendErrorResponse(w, "Failed to retrieve transactions", http.StatusInternalServerError)
		return
	}

	h.sendSuccessResponse(w, transactions, http.StatusOK)
}

// Helper methods
func (h *UserHandler) sendSuccessResponse(w http.ResponseWriter, data interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	response := models.SuccessResponse{
		Success: true,
		Data:    data,
	}

	json.NewEncoder(w).Encode(response)
}

func (h *UserHandler) sendErrorResponse(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	response := models.ErrorResponse{
		Error:   http.StatusText(statusCode),
		Message: message,
		Code:    statusCode,
	}

	json.NewEncoder(w).Encode(response)
}
