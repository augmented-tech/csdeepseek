package health

import (
	"encoding/json"
	"net/http"
	"runtime"
	"time"

	"csdeepseek/backend/services/session"
)

type Handler struct {
	sessionService *session.Service
}

type HealthResponse struct {
	Status    string    `json:"status"`
	Version   string    `json:"version"`
	Timestamp time.Time `json:"timestamp"`
	Runtime   struct {
		GoVersion    string `json:"go_version"`
		NumCPU       int    `json:"num_cpu"`
		NumGoroutine int    `json:"num_goroutine"`
		MemoryStats  struct {
			Alloc      uint64 `json:"alloc"`
			TotalAlloc uint64 `json:"total_alloc"`
			Sys        uint64 `json:"sys"`
			NumGC      uint32 `json:"num_gc"`
		} `json:"memory_stats"`
	} `json:"runtime"`
	Sessions struct {
		Total     int `json:"total"`
		Active    int `json:"active"`
		Inactive  int `json:"inactive"`
		MaxAge    int `json:"max_age_seconds"`
		CleanupIn int `json:"cleanup_in_seconds"`
	} `json:"sessions"`
}

func NewHandler(sessionService *session.Service) *Handler {
	return &Handler{
		sessionService: sessionService,
	}
}

func (h *Handler) HandleHealth(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	// Handle preflight
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Only allow GET
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get memory stats
	var memStats runtime.MemStats
	runtime.ReadMemStats(&memStats)

	// Get session stats
	sessions, _ := h.sessionService.ListSessions(r.Context())
	now := time.Now()
	active := 0
	inactive := 0
	for _, sess := range sessions {
		if now.Sub(sess.UpdatedAt) < time.Hour {
			active++
		} else {
			inactive++
		}
	}

	// Create response
	resp := HealthResponse{
		Status:    "healthy",
		Version:   "1.0.0",
		Timestamp: now,
		Runtime: struct {
			GoVersion    string `json:"go_version"`
			NumCPU       int    `json:"num_cpu"`
			NumGoroutine int    `json:"num_goroutine"`
			MemoryStats  struct {
				Alloc      uint64 `json:"alloc"`
				TotalAlloc uint64 `json:"total_alloc"`
				Sys        uint64 `json:"sys"`
				NumGC      uint32 `json:"num_gc"`
			} `json:"memory_stats"`
		}{
			GoVersion:    runtime.Version(),
			NumCPU:       runtime.NumCPU(),
			NumGoroutine: runtime.NumGoroutine(),
			MemoryStats: struct {
				Alloc      uint64 `json:"alloc"`
				TotalAlloc uint64 `json:"total_alloc"`
				Sys        uint64 `json:"sys"`
				NumGC      uint32 `json:"num_gc"`
			}{
				Alloc:      memStats.Alloc,
				TotalAlloc: memStats.TotalAlloc,
				Sys:        memStats.Sys,
				NumGC:      memStats.NumGC,
			},
		},
		Sessions: struct {
			Total     int `json:"total"`
			Active    int `json:"active"`
			Inactive  int `json:"inactive"`
			MaxAge    int `json:"max_age_seconds"`
			CleanupIn int `json:"cleanup_in_seconds"`
		}{
			Total:     len(sessions),
			Active:    active,
			Inactive:  inactive,
			MaxAge:    3600, // 1 hour default
			CleanupIn: 600,  // 10 minutes default
		},
	}

	// Send response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}
