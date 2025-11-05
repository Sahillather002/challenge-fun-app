package storage

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

// SupabaseStorage handles file uploads to Supabase Storage
type SupabaseStorage struct {
	url            string
	serviceRoleKey string
	bucket         string
	client         *http.Client
}

// UploadResponse represents the response from Supabase Storage upload
type UploadResponse struct {
	Key string `json:"Key"`
}

// NewSupabaseStorage creates a new Supabase Storage client
func NewSupabaseStorage() (*SupabaseStorage, error) {
	url := os.Getenv("SUPABASE_URL")
	serviceRoleKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")
	bucket := os.Getenv("SUPABASE_STORAGE_BUCKET")

	if url == "" {
		return nil, fmt.Errorf("SUPABASE_URL environment variable is not set")
	}
	if serviceRoleKey == "" {
		return nil, fmt.Errorf("SUPABASE_SERVICE_ROLE_KEY environment variable is not set")
	}
	if bucket == "" {
		bucket = "avatars" // default bucket name
	}

	return &SupabaseStorage{
		url:            url,
		serviceRoleKey: serviceRoleKey,
		bucket:         bucket,
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}, nil
}

// UploadAvatar uploads an avatar image to Supabase Storage
// Returns the public URL of the uploaded file
func (s *SupabaseStorage) UploadAvatar(userID string, file multipart.File, header *multipart.FileHeader) (string, error) {
	// Generate unique filename with timestamp
	ext := filepath.Ext(header.Filename)
	if ext == "" {
		ext = ".jpg"
	}
	timestamp := time.Now().Unix()
	filename := fmt.Sprintf("avatar_%d%s", timestamp, ext)
	
	// File path in Supabase Storage: avatars/{userID}/{filename}
	storagePath := fmt.Sprintf("%s/%s", userID, filename)

	// Read file content
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		return "", fmt.Errorf("failed to read file: %w", err)
	}

	// Create upload request
	uploadURL := fmt.Sprintf("%s/storage/v1/object/%s/%s", s.url, s.bucket, storagePath)
	
	req, err := http.NewRequest("POST", uploadURL, bytes.NewReader(fileBytes))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.serviceRoleKey))
	req.Header.Set("Content-Type", header.Header.Get("Content-Type"))
	req.Header.Set("x-upsert", "true") // Overwrite if file exists

	// Execute request
	resp, err := s.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to upload file: %w", err)
	}
	defer resp.Body.Close()

	// Check response
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("upload failed with status %d: %s", resp.StatusCode, string(body))
	}

	// Generate public URL
	publicURL := fmt.Sprintf("%s/storage/v1/object/public/%s/%s", s.url, s.bucket, storagePath)
	
	return publicURL, nil
}

// DeleteAvatar deletes an avatar from Supabase Storage
func (s *SupabaseStorage) DeleteAvatar(avatarURL string) error {
	// Extract storage path from URL
	// URL format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
	// We need to extract the path after /public/{bucket}/
	
	prefix := fmt.Sprintf("%s/storage/v1/object/public/%s/", s.url, s.bucket)
	if len(avatarURL) <= len(prefix) {
		return fmt.Errorf("invalid avatar URL format")
	}
	
	storagePath := avatarURL[len(prefix):]
	
	// Create delete request
	deleteURL := fmt.Sprintf("%s/storage/v1/object/%s/%s", s.url, s.bucket, storagePath)
	
	req, err := http.NewRequest("DELETE", deleteURL, nil)
	if err != nil {
		return fmt.Errorf("failed to create delete request: %w", err)
	}

	// Set headers
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.serviceRoleKey))

	// Execute request
	resp, err := s.client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to delete file: %w", err)
	}
	defer resp.Body.Close()

	// Check response (200 or 204 is success)
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNoContent {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("delete failed with status %d: %s", resp.StatusCode, string(body))
	}

	return nil
}

// GetPublicURL generates the public URL for a file in Supabase Storage
func (s *SupabaseStorage) GetPublicURL(userID, filename string) string {
	storagePath := fmt.Sprintf("%s/%s", userID, filename)
	return fmt.Sprintf("%s/storage/v1/object/public/%s/%s", s.url, s.bucket, storagePath)
}

// ListUserAvatars lists all avatars for a specific user
func (s *SupabaseStorage) ListUserAvatars(userID string) ([]string, error) {
	listURL := fmt.Sprintf("%s/storage/v1/object/list/%s", s.url, s.bucket)
	
	// Create request body
	requestBody := map[string]interface{}{
		"prefix": userID,
		"limit":  100,
	}
	
	bodyBytes, err := json.Marshal(requestBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}
	
	req, err := http.NewRequest("POST", listURL, bytes.NewReader(bodyBytes))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.serviceRoleKey))
	req.Header.Set("Content-Type", "application/json")

	// Execute request
	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to list files: %w", err)
	}
	defer resp.Body.Close()

	// Check response
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("list failed with status %d: %s", resp.StatusCode, string(body))
	}

	// Parse response
	var files []struct {
		Name string `json:"name"`
	}
	
	if err := json.NewDecoder(resp.Body).Decode(&files); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	// Generate public URLs
	urls := make([]string, len(files))
	for i, file := range files {
		urls[i] = s.GetPublicURL(userID, file.Name)
	}

	return urls, nil
}
