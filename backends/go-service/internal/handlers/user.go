package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/yourusername/health-competition-go/internal/models"
	"github.com/yourusername/health-competition-go/internal/services"
	"github.com/yourusername/health-competition-go/pkg/storage"
	"github.com/yourusername/health-competition-go/pkg/utils"

	"github.com/gorilla/mux"
)

type UserHandler struct {
	service *services.UserService
	logger  *utils.Logger
	storage *storage.SupabaseStorage
}

func NewUserHandler(service *services.UserService, logger *utils.Logger, supabaseStorage *storage.SupabaseStorage) *UserHandler {
	return &UserHandler{
		service: service,
		logger:  logger,
		storage: supabaseStorage,
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

// UploadAvatar handles POST /api/v1/users/:userId/avatar
func (h *UserHandler) UploadAvatar(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["userId"]

	// Parse multipart form (max 10MB)
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		h.sendErrorResponse(w, "File too large or invalid", http.StatusBadRequest)
		return
	}

	// Get file from form
	file, header, err := r.FormFile("avatar")
	if err != nil {
		h.sendErrorResponse(w, "No file uploaded", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Validate file type
	contentType := header.Header.Get("Content-Type")
	if !strings.HasPrefix(contentType, "image/") {
		h.sendErrorResponse(w, "File must be an image", http.StatusBadRequest)
		return
	}

	// Validate file size (5MB max)
	if header.Size > 5<<20 {
		h.sendErrorResponse(w, "Image size must be less than 5MB", http.StatusBadRequest)
		return
	}

	// Upload to Supabase Storage
	avatarURL, err := h.storage.UploadAvatar(userID, file, header)
	if err != nil {
		h.logger.Errorf("Failed to upload avatar to Supabase: %v", err)
		h.sendErrorResponse(w, "Failed to upload image", http.StatusInternalServerError)
		return
	}

	// Get old avatar URL for cleanup (optional)
	oldProfile, _ := h.service.GetUserProfile(r.Context(), userID)
	oldAvatarURL := ""
	if oldProfile != nil && oldProfile.Avatar != "" {
		oldAvatarURL = oldProfile.Avatar
	}

	// Update user avatar in database
	profile, err := h.service.UpdateUserAvatar(r.Context(), userID, avatarURL)
	if err != nil {
		h.logger.Errorf("Failed to update avatar: %v", err)
		// Clean up uploaded file from Supabase
		if deleteErr := h.storage.DeleteAvatar(avatarURL); deleteErr != nil {
			h.logger.Errorf("Failed to cleanup avatar after DB error: %v", deleteErr)
		}
		h.sendErrorResponse(w, "Failed to update avatar", http.StatusInternalServerError)
		return
	}

	// Delete old avatar from Supabase (if exists and is a Supabase URL)
	if oldAvatarURL != "" && strings.Contains(oldAvatarURL, "supabase.co") {
		if deleteErr := h.storage.DeleteAvatar(oldAvatarURL); deleteErr != nil {
			h.logger.Warnf("Failed to delete old avatar: %v", deleteErr)
			// Don't fail the request if old avatar deletion fails
		}
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
