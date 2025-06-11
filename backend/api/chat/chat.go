package chat

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"csdeepseek/backend/services/llm"
	"csdeepseek/backend/services/session"
	"csdeepseek/backend/services/vector"
)

type Handler struct {
	llmService     *llm.Service
	vectorService  *vector.Service
	sessionService *session.Service
}

type ChatRequest struct {
	SessionID string `json:"session_id"`
	Message   string `json:"message"`
}

type ChatResponse struct {
	SessionID string    `json:"session_id"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

func NewHandler(llmService *llm.Service, vectorService *vector.Service, sessionService *session.Service) *Handler {
	return &Handler{
		llmService:     llmService,
		vectorService:  vectorService,
		sessionService: sessionService,
	}
}

func (h *Handler) HandleChat(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	// Handle preflight
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Only allow POST
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse request
	var req ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Create context with timeout
	ctx, cancel := context.WithTimeout(r.Context(), 30*time.Second)
	defer cancel()

	// Get or create session
	var sess *session.Session
	var err error
	if req.SessionID == "" {
		sess, err = h.sessionService.CreateSession(ctx)
		if err != nil {
			log.Printf("Failed to create session: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
	} else {
		sess, err = h.sessionService.GetSession(ctx, req.SessionID)
		if err != nil {
			log.Printf("Session not found, creating new session: %v", err)
			sess, err = h.sessionService.CreateSession(ctx)
			if err != nil {
				log.Printf("Failed to create session: %v", err)
				http.Error(w, "Internal server error", http.StatusInternalServerError)
				return
			}
		}
	}

	// Add user message to session
	if err := h.sessionService.AddMessage(ctx, sess.ID, session.Message{
		Role:    "user",
		Content: req.Message,
	}); err != nil {
		log.Printf("Failed to add message: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Convert session.Messages to []llm.Message
	llmMessages := make([]llm.Message, len(sess.Messages))
	for i, m := range sess.Messages {
		llmMessages[i] = llm.Message{
			Role:    m.Role,
			Content: m.Content,
		}
	}

	// Generate response using full session history
	response, err := h.llmService.GenerateResponse(ctx, llmMessages)
	if err != nil {
		log.Printf("Failed to generate response: %v", err)
		http.Error(w, "Failed to generate response", http.StatusInternalServerError)
		return
	}

	// Add assistant message to session
	if err := h.sessionService.AddMessage(ctx, sess.ID, session.Message{
		Role:    "assistant",
		Content: response,
	}); err != nil {
		log.Printf("Failed to add message: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Send response
	resp := ChatResponse{
		SessionID: sess.ID,
		Message:   response,
		Timestamp: time.Now(),
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		log.Printf("Failed to encode response: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}
