package session

import (
	"context"
	"fmt"
	"sync"
	"time"
)

type Service struct {
	sessions map[string]*Session
	mu       sync.RWMutex
}

type Session struct {
	ID        string    `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Messages  []Message `json:"messages"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

func NewService() *Service {
	return &Service{
		sessions: make(map[string]*Session),
	}
}

// CreateSession creates a new session
func (s *Service) CreateSession(ctx context.Context) (*Session, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	now := time.Now()
	session := &Session{
		ID:        generateID(),
		CreatedAt: now,
		UpdatedAt: now,
		Messages:  make([]Message, 0),
	}

	s.sessions[session.ID] = session
	return session, nil
}

// GetSession retrieves a session by ID
func (s *Service) GetSession(ctx context.Context, id string) (*Session, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	session, exists := s.sessions[id]
	if !exists {
		return nil, fmt.Errorf("session not found")
	}

	return session, nil
}

// AddMessage adds a message to a session
func (s *Service) AddMessage(ctx context.Context, sessionID string, msg Message) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	session, exists := s.sessions[sessionID]
	if !exists {
		return fmt.Errorf("session not found")
	}

	session.Messages = append(session.Messages, msg)
	session.UpdatedAt = time.Now()
	return nil
}

// ListSessions returns all sessions
func (s *Service) ListSessions(ctx context.Context) ([]*Session, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	sessions := make([]*Session, 0, len(s.sessions))
	for _, session := range s.sessions {
		sessions = append(sessions, session)
	}

	return sessions, nil
}

// DeleteSession deletes a session
func (s *Service) DeleteSession(ctx context.Context, id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.sessions[id]; !exists {
		return fmt.Errorf("session not found")
	}

	delete(s.sessions, id)
	return nil
}

// generateID generates a unique session ID
func generateID() string {
	return fmt.Sprintf("sess_%d", time.Now().UnixNano())
}

// StartCleanupLoop starts a background goroutine to delete old sessions.
func (s *Service) StartCleanupLoop(timeout, interval time.Duration) {
	go func() {
		fmt.Printf("[SessionCleanup] Starting cleanup loop\n")
		for {
			time.Sleep(interval)
			fmt.Printf("[SessionCleanup] Checking for sessions older than %v\n", timeout)
			s.mu.Lock()
			now := time.Now()
			deleted := 0
			for id, sess := range s.sessions {
				if now.Sub(sess.UpdatedAt) > timeout {
					delete(s.sessions, id)
					deleted++
				}
			}
			s.mu.Unlock()
			if deleted > 0 {
				fmt.Printf("[SessionCleanup] Deleted %d sessions older than %v\n", deleted, timeout)
			}
		}
	}()
}
