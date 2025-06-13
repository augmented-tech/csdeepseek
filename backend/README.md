# CSDeepSeek Backend

A Go-based backend service for the CSDeepSeek application, providing chat functionality with AI-powered responses.

# CSDeepSeek 后端

基于 Go 的 CSDeepSeek 应用后端服务，提供 AI 驱动的聊天功能。

## Features

- Chat API with session management
- Health monitoring endpoint
- Vector embeddings for semantic search
- LLM integration with DeepSeek
- CORS support
- Graceful shutdown
- Comprehensive error handling
- Runtime metrics

## 功能特点

- 带会话管理的聊天 API
- 健康监控端点
- 用于语义搜索的向量嵌入
- DeepSeek LLM 集成
- CORS 支持
- 优雅关闭
- 全面的错误处理
- 运行时指标

## Prerequisites

- Go 1.21 or later
- DeepSeek API key

## 前置要求

- Go 1.21 或更高版本
- DeepSeek API 密钥

## Environment Variables

```bash
DEEPSEEK_API_KEY=your_api_key_here
```

## 环境变量

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

## 项目结构

```
backend/
├── api/
│   ├── chat/      # 聊天 API 处理器
│   └── health/    # 健康检查端点
├── services/
│   ├── llm/       # LLM 服务集成
│   ├── session/   # 会话管理
│   └── vector/    # 向量操作
├── main.go        # 应用程序入口点
└── go.mod         # Go 模块文件
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

## API 端点

### 聊天 API

```http
POST /api/chat
Content-Type: application/json

{
    "session_id": "optional_session_id",
    "message": "user message"
}
```

响应：
```json
{
    "session_id": "session_id",
    "message": "assistant response",
    "timestamp": "2024-03-21T12:00:00Z"
}
```

### 健康检查

```http
GET /api/health
```

响应：
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

### WebSocket 流式聊天 API

**新功能！** 通过 WebSocket 实现实时流式聊天。

**端点：**
```
/ws/chat
```

**协议：**
- 通过 WebSocket 连接到 `/ws/chat`
- 发送 JSON 消息：
  ```json
  { "session_id": "optional_session_id", "message": "user message" }
  ```
- 服务器将在生成令牌时流式返回 JSON 消息：
  ```json
  { "type": "token", "content": "Hello" }
  { "type": "token", "content": ", world!" }
  ...
  { "type": "done", "content": "" }
  ```
- 如果发生错误，服务器将发送：
  ```json
  { "type": "error", "content": "error message" }
  ```

**注意事项：**
- 与 HTTP API 一样，使用完整的会话历史作为上下文
- 如果省略 `session_id` 或未找到，将创建新会话
- 此端点不会破坏或替换现有的 HTTP API
- 适用于实时、逐令牌的聊天界面（例如，在微信小程序中流式显示）

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

## 运行服务

1. 设置环境变量：
   ```bash
   export DEEPSEEK_API_KEY=your_api_key_here
   ```

2. 运行服务：
   ```bash
   go run main.go
   ```

服务将在 8080 端口启动。

## Development

### Building

```bash
go build -o csdeepseek
```

### Testing

```bash
go test ./...
```

## 开发

### 构建

```bash
go build -o csdeepseek
```

### 测试

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

## 错误处理

服务实现了全面的错误处理：
- 输入验证
- API 错误响应
- 优雅关闭
- 超时处理
- 会话管理错误

## Security

- CORS headers
- API key authentication
- Request validation
- Timeout protection
- Error message sanitization

## 安全

- CORS 头
- API 密钥认证
- 请求验证
- 超时保护
- 错误消息净化

## Monitoring

The health endpoint provides:
- System status
- Runtime metrics
- Memory statistics
- Goroutine count
- CPU information

## 监控

健康端点提供：
- 系统状态
- 运行时指标
- 内存统计
- Goroutine 计数
- CPU 信息

## License

MIT License

## 许可证

MIT 许可证 