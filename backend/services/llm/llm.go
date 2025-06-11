package llm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

type Service struct {
	apiKey     string
	apiURL     string
	httpClient *http.Client
}

type CompletionRequest struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type CompletionResponse struct {
	Choices []struct {
		Message Message `json:"message"`
	} `json:"choices"`
}

type LlmStreamToken struct {
	Type    string // "token", "done", "error"
	Content string
}

type LLMStreamer interface {
	StreamResponse(ctx context.Context, messages []Message) (<-chan LlmStreamToken, error)
}

func NewService() *Service {
	return &Service{
		apiKey: os.Getenv("DEEPSEEK_API_KEY"),
		apiURL: "https://api.deepseek.com/v1/chat/completions",
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

func (s *Service) GenerateResponse(ctx context.Context, messages []Message) (string, error) {
	if s.apiKey == "" {
		return "", fmt.Errorf("API key not configured")
	}

	req := CompletionRequest{
		Model:    "deepseek-chat",
		Messages: messages,
	}

	reqBody, err := json.Marshal(req)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(ctx, "POST", s.apiURL, bytes.NewBuffer(reqBody))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.apiKey))

	resp, err := s.httpClient.Do(httpReq)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API request failed with status %d", resp.StatusCode)
	}

	var completionResp CompletionResponse
	if err := json.NewDecoder(resp.Body).Decode(&completionResp); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	if len(completionResp.Choices) == 0 {
		return "", fmt.Errorf("no response from model")
	}

	return completionResp.Choices[0].Message.Content, nil
}

// StreamResponse streams tokens from DeepSeek API
func (s *Service) StreamResponse(ctx context.Context, messages []Message) (<-chan LlmStreamToken, error) {
	ch := make(chan LlmStreamToken)

	go func() {
		defer close(ch)
		if s.apiKey == "" {
			ch <- LlmStreamToken{Type: "error", Content: "API key not configured"}
			return
		}

		reqBodyMap := map[string]interface{}{
			"model":    "deepseek-chat",
			"messages": messages,
			"stream":   true,
		}
		reqBody, err := json.Marshal(reqBodyMap)
		if err != nil {
			ch <- LlmStreamToken{Type: "error", Content: "failed to marshal request"}
			return
		}

		httpReq, err := http.NewRequestWithContext(ctx, "POST", s.apiURL, bytes.NewBuffer(reqBody))
		if err != nil {
			ch <- LlmStreamToken{Type: "error", Content: "failed to create request"}
			return
		}
		httpReq.Header.Set("Content-Type", "application/json")
		httpReq.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.apiKey))

		resp, err := s.httpClient.Do(httpReq)
		if err != nil {
			ch <- LlmStreamToken{Type: "error", Content: "failed to send request"}
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			ch <- LlmStreamToken{Type: "error", Content: fmt.Sprintf("API request failed with status %d", resp.StatusCode)}
			return
		}

		// Read the response line by line (SSE or chunked JSON)
		buf := make([]byte, 4096)
		var partial string
		for {
			n, err := resp.Body.Read(buf)
			if n > 0 {
				partial += string(buf[:n])
				for {
					idx := -1
					if i := findNewline(partial); i >= 0 {
						idx = i
					}
					if idx == -1 {
						break
					}
					line := partial[:idx]
					partial = partial[idx+1:]
					line = trimSSEPrefix(line)
					if line == "" {
						continue
					}
					if line == "[DONE]" {
						ch <- LlmStreamToken{Type: "done", Content: ""}
						return
					}
					var sse struct {
						Choices []struct {
							Delta struct {
								Content string `json:"content"`
							} `json:"delta"`
						} `json:"choices"`
					}
					if err := json.Unmarshal([]byte(line), &sse); err == nil {
						for _, choice := range sse.Choices {
							if choice.Delta.Content != "" {
								ch <- LlmStreamToken{Type: "token", Content: choice.Delta.Content}
							}
						}
					}
				}
			}
			if err != nil {
				break
			}
		}
		ch <- LlmStreamToken{Type: "done", Content: ""}
	}()

	return ch, nil
}

// Helper: find first newline (\n or \r\n)
func findNewline(s string) int {
	for i := 0; i < len(s); i++ {
		if s[i] == '\n' {
			return i
		}
	}
	return -1
}

// Helper: trim SSE prefix (e.g., "data: ")
func trimSSEPrefix(s string) string {
	if len(s) >= 6 && s[:6] == "data: " {
		return s[6:]
	}
	return s
}
