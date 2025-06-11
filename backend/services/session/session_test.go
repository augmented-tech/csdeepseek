package session

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNewService(t *testing.T) {
	service := NewService()
	assert.NotNil(t, service)
	assert.NotNil(t, service.sessions)
	assert.Empty(t, service.sessions)
}

func TestCreateSession(t *testing.T) {
	service := NewService()
	ctx := context.Background()

	session, err := service.CreateSession(ctx)
	require.NoError(t, err)
	assert.NotNil(t, session)
	assert.NotEmpty(t, session.ID)
	assert.True(t, session.CreatedAt.Equal(session.UpdatedAt))
	assert.Empty(t, session.Messages)
}

func TestGetSession(t *testing.T) {
	service := NewService()
	ctx := context.Background()

	// Create a session
	created, err := service.CreateSession(ctx)
	require.NoError(t, err)

	// Get the session
	retrieved, err := service.GetSession(ctx, created.ID)
	require.NoError(t, err)
	assert.Equal(t, created.ID, retrieved.ID)
	assert.Equal(t, created.CreatedAt, retrieved.CreatedAt)
	assert.Equal(t, created.UpdatedAt, retrieved.UpdatedAt)
}

func TestGetSession_NotFound(t *testing.T) {
	service := NewService()
	ctx := context.Background()

	_, err := service.GetSession(ctx, "non-existent")
	assert.Error(t, err)
	assert.Equal(t, "session not found", err.Error())
}

func TestAddMessage(t *testing.T) {
	service := NewService()
	ctx := context.Background()

	// Create a session
	session, err := service.CreateSession(ctx)
	require.NoError(t, err)

	// Add a message
	msg := Message{
		Role:    "user",
		Content: "Hello, world!",
	}
	err = service.AddMessage(ctx, session.ID, msg)
	require.NoError(t, err)

	// Verify the message was added
	retrieved, err := service.GetSession(ctx, session.ID)
	require.NoError(t, err)
	require.Len(t, retrieved.Messages, 1)
	assert.Equal(t, msg, retrieved.Messages[0])
	assert.True(t, retrieved.UpdatedAt.After(retrieved.CreatedAt))
}

func TestAddMessage_NotFound(t *testing.T) {
	service := NewService()
	ctx := context.Background()

	msg := Message{
		Role:    "user",
		Content: "Hello, world!",
	}
	err := service.AddMessage(ctx, "non-existent", msg)
	assert.Error(t, err)
	assert.Equal(t, "session not found", err.Error())
}

func TestListSessions(t *testing.T) {
	service := NewService()
	ctx := context.Background()

	// Create multiple sessions
	session1, err := service.CreateSession(ctx)
	require.NoError(t, err)
	session2, err := service.CreateSession(ctx)
	require.NoError(t, err)

	// List sessions
	sessions, err := service.ListSessions(ctx)
	require.NoError(t, err)
	assert.Len(t, sessions, 2)

	// Verify both sessions are in the list
	sessionIDs := make(map[string]bool)
	for _, s := range sessions {
		sessionIDs[s.ID] = true
	}
	assert.True(t, sessionIDs[session1.ID])
	assert.True(t, sessionIDs[session2.ID])
}

func TestDeleteSession(t *testing.T) {
	service := NewService()
	ctx := context.Background()

	// Create a session
	session, err := service.CreateSession(ctx)
	require.NoError(t, err)

	// Delete the session
	err = service.DeleteSession(ctx, session.ID)
	require.NoError(t, err)

	// Verify the session is gone
	_, err = service.GetSession(ctx, session.ID)
	assert.Error(t, err)
	assert.Equal(t, "session not found", err.Error())
}

func TestDeleteSession_NotFound(t *testing.T) {
	service := NewService()
	ctx := context.Background()

	err := service.DeleteSession(ctx, "non-existent")
	assert.Error(t, err)
	assert.Equal(t, "session not found", err.Error())
}

func TestConcurrentOperations(t *testing.T) {
	service := NewService()
	ctx := context.Background()

	// Create a session
	session, err := service.CreateSession(ctx)
	require.NoError(t, err)

	// Perform concurrent operations
	done := make(chan bool)
	for i := 0; i < 10; i++ {
		go func() {
			msg := Message{
				Role:    "user",
				Content: "Concurrent message",
			}
			_ = service.AddMessage(ctx, session.ID, msg)
			done <- true
		}()
	}

	// Wait for all goroutines to complete
	for i := 0; i < 10; i++ {
		<-done
	}

	// Verify the results
	retrieved, err := service.GetSession(ctx, session.ID)
	require.NoError(t, err)
	assert.Len(t, retrieved.Messages, 10)
}

func TestSessionCleanupLoop(t *testing.T) {
	svc := NewService()
	ctx := context.Background()

	// Create 2 sessions: one old, one recent
	oldSess, _ := svc.CreateSession(ctx)
	recentSess, _ := svc.CreateSession(ctx)

	// Manually set old session's UpdatedAt to 2 hours ago
	svc.mu.Lock()
	oldSess.UpdatedAt = time.Now().Add(-2 * time.Hour)
	svc.mu.Unlock()

	// Run cleanup with 1 hour timeout, 10ms interval (run only once for test)
	done := make(chan struct{})
	go func() {
		svc.StartCleanupLoop(1*time.Hour, 10*time.Millisecond)
		time.Sleep(50 * time.Millisecond)
		close(done)
	}()
	<-done

	// Check that old session is deleted, recent one remains
	svc.mu.RLock()
	_, oldExists := svc.sessions[oldSess.ID]
	_, recentExists := svc.sessions[recentSess.ID]
	svc.mu.RUnlock()

	if oldExists {
		t.Errorf("Old session was not cleaned up")
	}
	if !recentExists {
		t.Errorf("Recent session was incorrectly deleted")
	}
}
