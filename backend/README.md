# CSDeepSeek Backend

A Go-based backend service for the CSDeepSeek application, providing chat functionality with AI-powered responses.

## Features

- Chat API with session management
- Health monitoring endpoint
- Vector embeddings for semantic search
- LLM integration with DeepSeek
- CORS support
- Graceful shutdown
- Comprehensive error handling
- Runtime metrics

## Prerequisites

- Go 1.21 or later
- DeepSeek API key

## Environment Variables

```bash
DEEPSEEK_API_KEY=your_api_key_here
```

## Project Structure

```
backend/
├── api/
│   ├── chat/      # Chat API handlers
│   └── health/    # Health check endpoint
├── services/
│   ├── llm/       # LLM service integration
│   ├── session/   # Session management
│   └── vector/    # Vector operations
├── main.go        # Application entry point
└── go.mod         # Go module file
```

## API Endpoints

### Chat API

```http
POST /api/chat
Content-Type: application/json

{
    "session_id": "optional_session_id",
    "message": "user message"
}
```

Response:
```json
{
    "session_id": "session_id",
    "message": "assistant response",
    "timestamp": "2024-03-21T12:00:00Z"
}
```

### Health Check

```http
GET /api/health
```

Response:
```json
{
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2024-03-21T12:00:00Z",
    "runtime": {
        "go_version": "go1.21.0",
        "num_cpu": 8,
        "num_goroutine": 10,
        "memory_stats": {
            "alloc": 1234567,
            "total_alloc": 12345678,
            "sys": 123456789,
            "num_gc": 5
        }
    }
}
```

### WebSocket Streaming Chat API

**New!** Real-time streaming chat via WebSocket.

**Endpoint:**
```
/ws/chat
```

**Protocol:**
- Connect via WebSocket to `/ws/chat`.
- Send a JSON message:
  ```json
  { "session_id": "optional_session_id", "message": "user message" }
  ```
- The server will stream back JSON messages as tokens are generated:
  ```json
  { "type": "token", "content": "Hello" }
  { "type": "token", "content": ", world!" }
  ...
  { "type": "done", "content": "" }
  ```
- If an error occurs, the server will send:
  ```json
  { "type": "error", "content": "error message" }
  ```

**Notes:**
- The full session history is used for context, just like the HTTP API.
- If `session_id` is omitted or not found, a new session is created.
- This endpoint does not break or replace the existing HTTP API.
- Useful for real-time, token-by-token chat UIs (e.g., streaming in Weixin Mini Program).

## Running the Service

1. Set up environment variables:
   ```bash
   export DEEPSEEK_API_KEY=your_api_key_here
   ```

2. Run the service:
   ```bash
   go run main.go
   ```

The service will start on port 8080.

## Development

### Building

```bash
go build -o csdeepseek
```

### Testing

```bash
go test ./...
```

## Error Handling

The service implements comprehensive error handling:
- Input validation
- API error responses
- Graceful shutdown
- Timeout handling
- Session management errors

## Security

- CORS headers
- API key authentication
- Request validation
- Timeout protection
- Error message sanitization

## Monitoring

The health endpoint provides:
- System status
- Runtime metrics
- Memory statistics
- Goroutine count
- CPU information

## License

MIT License 