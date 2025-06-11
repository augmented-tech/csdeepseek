package chat

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"

	"csdeepseek/backend/services/llm"
	"csdeepseek/backend/services/session"
)

type WSHandler struct {
	llmService     llm.LLMStreamer
	sessionService *session.Service
}

type wsChatRequest struct {
	SessionID string `json:"session_id"`
	Message   string `json:"message"`
}

type wsChatToken struct {
	Type    string `json:"type"` // "token" or "done" or "error"
	Content string `json:"content"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func NewWSHandler(llmService llm.LLMStreamer, sessionService *session.Service) *WSHandler {
	return &WSHandler{
		llmService:     llmService,
		sessionService: sessionService,
	}
}

func (h *WSHandler) HandleWSChat(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade failed: %v", err)
		return
	}
	defer conn.Close()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Printf("WebSocket read error: %v", err)
			return
		}

		var req wsChatRequest
		if err := json.Unmarshal(msg, &req); err != nil {
			conn.WriteJSON(wsChatToken{Type: "error", Content: "Invalid request"})
			continue
		}

		ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
		defer cancel()

		// Get or create session
		sess, err := h.sessionService.GetSession(ctx, req.SessionID)
		if err != nil {
			// Create new session if not found
			sess, err = h.sessionService.CreateSession(ctx)
			if err != nil {
				conn.WriteJSON(wsChatToken{Type: "error", Content: "Failed to create session"})
				continue
			}
		}

		// Add user message to session
		err = h.sessionService.AddMessage(ctx, sess.ID, session.Message{
			Role:    "user",
			Content: req.Message,
		})
		if err != nil {
			conn.WriteJSON(wsChatToken{Type: "error", Content: "Failed to add message"})
			continue
		}

		// Convert session.Messages to []llm.Message
		llmMessages := make([]llm.Message, len(sess.Messages))
		for i, m := range sess.Messages {
			llmMessages[i] = llm.Message{
				Role:    m.Role,
				Content: m.Content,
			}
		}

		// Call DeepSeek with streaming (pseudo-code, replace with actual streaming logic)
		stream, err := h.llmService.StreamResponse(ctx, llmMessages)
		if err != nil {
			conn.WriteJSON(wsChatToken{Type: "error", Content: "Failed to stream response"})
			continue
		}

		for token := range stream {
			if token.Type == "error" {
				conn.WriteJSON(wsChatToken{Type: "error", Content: token.Content})
				break
			}
			conn.WriteJSON(wsChatToken{Type: "token", Content: token.Content})
		}
		conn.WriteJSON(wsChatToken{Type: "done", Content: ""})
	}
}
