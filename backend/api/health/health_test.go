package health

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"csdeepseek/backend/services/session"

	"github.com/stretchr/testify/assert"
)

type healthResponse struct {
	Status   string `json:"status"`
	Sessions struct {
		Total    int `json:"total"`
		Active   int `json:"active"`
		Inactive int `json:"inactive"`
	} `json:"sessions"`
}

func TestHandleHealth_Basic(t *testing.T) {
	sessSvc := session.NewService()
	h := NewHandler(sessSvc)
	req := httptest.NewRequest(http.MethodGet, "/api/health", nil)
	rw := httptest.NewRecorder()

	h.HandleHealth(rw, req)
	resp := rw.Result()
	defer resp.Body.Close()

	assert.Equal(t, http.StatusOK, resp.StatusCode)
	var hr healthResponse
	err := json.NewDecoder(resp.Body).Decode(&hr)
	assert.NoError(t, err)
	assert.Equal(t, "healthy", hr.Status)
	assert.Equal(t, 0, hr.Sessions.Total)
	assert.Equal(t, 0, hr.Sessions.Active)
	assert.Equal(t, 0, hr.Sessions.Inactive)
}

func TestHandleHealth_WithSessions(t *testing.T) {
	sessSvc := session.NewService()
	ctx := context.Background()
	// Add one active and one inactive session
	_, _ = sessSvc.CreateSession(ctx)
	inactive, _ := sessSvc.CreateSession(ctx)
	// Make inactive session old
	inactive.UpdatedAt = time.Now().Add(-2 * time.Hour)

	h := NewHandler(sessSvc)
	req := httptest.NewRequest(http.MethodGet, "/api/health", nil)
	rw := httptest.NewRecorder()

	h.HandleHealth(rw, req)
	resp := rw.Result()
	defer resp.Body.Close()

	assert.Equal(t, http.StatusOK, resp.StatusCode)
	var hr healthResponse
	err := json.NewDecoder(resp.Body).Decode(&hr)
	assert.NoError(t, err)
	assert.Equal(t, 2, hr.Sessions.Total)
	assert.Equal(t, 1, hr.Sessions.Active)
	assert.Equal(t, 1, hr.Sessions.Inactive)
}

func TestHandleHealth_MethodNotAllowed(t *testing.T) {
	sessSvc := session.NewService()
	h := NewHandler(sessSvc)
	req := httptest.NewRequest(http.MethodPost, "/api/health", nil)
	rw := httptest.NewRecorder()

	h.HandleHealth(rw, req)
	resp := rw.Result()
	defer resp.Body.Close()

	assert.Equal(t, http.StatusMethodNotAllowed, resp.StatusCode)
}
