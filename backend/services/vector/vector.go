package vector

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

type EmbeddingRequest struct {
	Model string   `json:"model"`
	Input []string `json:"input"`
}

type EmbeddingResponse struct {
	Data []struct {
		Embedding []float64 `json:"embedding"`
		Index     int       `json:"index"`
	} `json:"data"`
}

func NewService() *Service {
	return &Service{
		apiKey: os.Getenv("DEEPSEEK_API_KEY"),
		apiURL: "https://api.deepseek.com/v1/embeddings",
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// GetEmbedding generates embeddings for the given text
func (s *Service) GetEmbedding(ctx context.Context, text string) ([]float64, error) {
	if s.apiKey == "" {
		return nil, fmt.Errorf("API key not configured")
	}

	req := EmbeddingRequest{
		Model: "deepseek-embed",
		Input: []string{text},
	}

	reqBody, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(ctx, "POST", s.apiURL, bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.apiKey))

	resp, err := s.httpClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status %d", resp.StatusCode)
	}

	var embeddingResp EmbeddingResponse
	if err := json.NewDecoder(resp.Body).Decode(&embeddingResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	if len(embeddingResp.Data) == 0 {
		return nil, fmt.Errorf("no embeddings returned")
	}

	return embeddingResp.Data[0].Embedding, nil
}

// CosineSimilarity calculates the cosine similarity between two vectors
func (s *Service) CosineSimilarity(a, b []float64) (float64, error) {
	if len(a) != len(b) {
		return 0, fmt.Errorf("vectors must have the same length")
	}

	var dotProduct float64
	var normA float64
	var normB float64

	for i := range a {
		dotProduct += a[i] * b[i]
		normA += a[i] * a[i]
		normB += b[i] * b[i]
	}

	if normA == 0 || normB == 0 {
		return 0, fmt.Errorf("zero vector")
	}

	return dotProduct / (normA * normB), nil
}
