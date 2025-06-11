package chat

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/websocket"

	"csdeepseek/backend/services/llm"
	"csdeepseek/backend/services/session"
)

type mockLLMService struct{}

func (m *mockLLMService) StreamResponse(ctx context.Context, messages []llm.Message) (<-chan llm.LlmStreamToken, error) {
	ch := make(chan llm.LlmStreamToken)
	go func() {
		defer close(ch)
		ch <- llm.LlmStreamToken{Type: "token", Content: "Hello"}
		ch <- llm.LlmStreamToken{Type: "token", Content: ", world!"}
		ch <- llm.LlmStreamToken{Type: "done", Content: ""}
	}()
	return ch, nil
}

func TestWSChatHandler_Basic(t *testing.T) {
	sessSvc := session.NewService()
	llmSvc := &mockLLMService{}
	h := NewWSHandler(llmSvc, sessSvc)

	ts := httptest.NewServer(http.HandlerFunc(h.HandleWSChat))
	defer ts.Close()

	// Convert http://127.0.0.1 to ws://
	wsURL := "ws" + ts.URL[len("http"):] // ws://127.0.0.1:port

	c, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("WebSocket dial failed: %v", err)
	}
	defer c.Close()

	req := wsChatRequest{SessionID: "", Message: "Test message"}
	if err := c.WriteJSON(req); err != nil {
		t.Fatalf("WriteJSON failed: %v", err)
	}

	tokens := []string{}
	for {
		_, msg, err := c.ReadMessage()
		if err != nil {
			t.Fatalf("ReadMessage failed: %v", err)
		}
		var resp wsChatToken
		if err := json.Unmarshal(msg, &resp); err != nil {
			t.Fatalf("Unmarshal failed: %v", err)
		}
		if resp.Type == "token" {
			tokens = append(tokens, resp.Content)
		} else if resp.Type == "done" {
			break
		} else if resp.Type == "error" {
			t.Fatalf("Received error: %s", resp.Content)
		}
	}

	if len(tokens) == 0 || tokens[0] != "Hello" {
		t.Fatalf("Expected at least one token 'Hello', got: %v", tokens)
	}
}
