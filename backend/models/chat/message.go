package chat

import (
	"errors"
	"time"
)

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type Conversation struct {
	ID        string    `json:"id"`
	Messages  []Message `json:"messages"`
	CreatedAt string    `json:"created_at"`
	UpdatedAt string    `json:"updated_at"`
}

// Validate checks if the message is valid
func (m *Message) Validate() error {
	if m.Role != "user" && m.Role != "assistant" {
		return errors.New("invalid role: must be 'user' or 'assistant'")
	}
	if m.Content == "" {
		return errors.New("content cannot be empty")
	}
	return nil
}

// NewConversation creates a new conversation
func NewConversation() *Conversation {
	now := time.Now().UTC().Format(time.RFC3339)
	return &Conversation{
		ID:        generateID(),
		Messages:  make([]Message, 0),
		CreatedAt: now,
		UpdatedAt: now,
	}
}

// AddMessage adds a message to the conversation
func (c *Conversation) AddMessage(msg Message) error {
	if err := msg.Validate(); err != nil {
		return err
	}
	c.Messages = append(c.Messages, msg)
	c.UpdatedAt = time.Now().UTC().Format(time.RFC3339)
	return nil
}

// generateID generates a unique ID for conversations
func generateID() string {
	return time.Now().UTC().Format("20060102150405")
}
