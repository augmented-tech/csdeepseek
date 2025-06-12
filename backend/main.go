package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/joho/godotenv"

	"csdeepseek/backend/api/chat"
	"csdeepseek/backend/api/health"
	"csdeepseek/backend/services/llm"
	"csdeepseek/backend/services/session"
	"csdeepseek/backend/services/vector"
)

func main() {
	// Load .env file if present
	if err := godotenv.Load(); err == nil {
		log.Println("Loaded environment variables from .env file")
	} else {
		log.Println("No .env file found or failed to load .env (this is OK if using shell env vars)")
	}

	// Initialize services
	llmService := llm.NewService()
	vectorService := vector.NewService()
	sessionService := session.NewService()

	// Start session cleanup loop
	timeout := 1 * time.Hour
	interval := 10 * time.Minute
	if v := os.Getenv("SESSION_TIMEOUT"); v != "" {
		if secs, err := time.ParseDuration(v + "s"); err == nil {
			timeout = secs
		}
	}
	if v := os.Getenv("SESSION_CLEANUP_INTERVAL"); v != "" {
		if secs, err := time.ParseDuration(v + "s"); err == nil {
			interval = secs
		}
	}
	sessionService.StartCleanupLoop(timeout, interval)

	// Initialize handlers
	chatHandler := chat.NewHandler(llmService, vectorService, sessionService)
	healthHandler := health.NewHandler(sessionService)
	wsChatHandler := chat.NewWSHandler(llmService, sessionService)

	// Setup routes
	mux := http.NewServeMux()
	mux.HandleFunc("/api/chat", chatHandler.HandleChat)
	mux.HandleFunc("/api/health", healthHandler.HandleHealth)
	mux.HandleFunc("/ws/chat", wsChatHandler.HandleWSChat)

	// Create server

	port := os.Getenv("PORT")
	if port == "" {
		port = "7071"
	}
	server := &http.Server{
		Addr:         ":" + port,
		Handler:      mux,
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// Start server in a goroutine
	go func() {
		log.Printf("Server starting on :%s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	// Create shutdown context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Attempt graceful shutdown
	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exiting")
}
