# 🚀 CSDeepSeek - WeChat Mini Program AI Chat

> A production-ready WeChat Mini Program with Go backend showcasing modern AI chat implementation using DeepSeek LLM.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Go Version](https://img.shields.io/badge/Go-1.21%2B-blue.svg)](https://golang.org/)
[![WeChat](https://img.shields.io/badge/WeChat-Mini%20Program-green.svg)](https://developers.weixin.qq.com/miniprogram/dev/)

## ✨ Features

### 🎯 WeChat Mini Program (Frontend)
- **Perfect Chat UI** - Native WeChat design with message bubbles, animations, and smooth scrolling
- **Multi-modal Input** - Text, voice recording, and image upload support
- **Real-time Communication** - HTTP and WebSocket support for flexible backend integration
- **Session Management** - Persistent conversations with clear history functionality
- **Chinese Market Optimized** - Floating action buttons, proper fonts, and cultural considerations
- **Professional Branding** - Custom SVG logos and assets included

### ⚡ Go Backend API
- **DeepSeek Integration** - Complete LLM integration with streaming support
- **Dual API Modes** - REST endpoints + WebSocket streaming for real-time chat
- **Production Ready** - Health monitoring, graceful shutdown, error handling
- **Session Management** - Thread-safe session storage with automatic cleanup
- **Docker Support** - Multi-stage Docker builds for efficient deployment
- **Comprehensive Testing** - Unit tests and integration test examples

## 🏗️ Architecture

```
csdeepseek/
├── 📱 frontend/          # WeChat Mini Program
│   ├── pages/           # Chat, settings, and other pages
│   ├── components/      # Reusable UI components
│   ├── services/        # API communication layer
│   └── assets/          # Images, icons, and branding
│
└── 🔧 backend/          # Go API Service
    ├── api/             # HTTP & WebSocket handlers
    ├── services/        # Business logic (LLM, sessions, vector)
    ├── models/          # Data structures
    └── utils/           # Helper functions
```

## 🚀 Quick Start

### Prerequisites
- [WeChat Developer Tools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- [Go 1.21+](https://golang.org/dl/)
- [Docker](https://www.docker.com/) (optional)
- DeepSeek API Key ([Get one here](https://platform.deepseek.com/))

### 🎯 Frontend Setup (WeChat Mini Program)

1. **Open in WeChat Developer Tools**
   ```bash
   # Import the frontend directory as a new project
   WeChat Developer Tools > Import Project > Select: csdeepseek/frontend/
   ```

2. **Configure API endpoint**
   ```javascript
   // In csdeepseek/frontend/services/api/api.js
   const BASE_URL = 'http://localhost:7071/api'  // Point to your backend
   ```

3. **Run the Mini Program**
   - Click "Compile" in WeChat Developer Tools
   - Test in simulator or on real device

### ⚡ Backend Setup (Go API)

1. **Install dependencies**
   ```bash
   cd csdeepseek/backend
   go mod tidy
   ```

2. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env and add your DeepSeek API key
   export DEEPSEEK_API_KEY=your_api_key_here
   ```

3. **Run locally**
   ```bash
   go run main.go
   # Server starts on http://localhost:7071
   ```

4. **Or use Docker**
   ```bash
   docker build -t csdeepseek-backend .
   docker run -p 7071:7071 -e DEEPSEEK_API_KEY=your_key csdeepseek-backend
   ```

## 📚 API Documentation

### 💬 Chat Endpoints

#### HTTP Chat
```http
POST /api/chat
Content-Type: application/json

{
    "session_id": "optional_session_id",
    "message": "Hello, how can you help me?"
}
```

#### WebSocket Streaming Chat
```javascript
const ws = new WebSocket('ws://localhost:7071/ws/chat');
ws.send(JSON.stringify({
    session_id: "optional_session_id", 
    message: "Tell me about your services"
}));
```

#### Health Check
```http
GET /api/health
```

## 🎨 Screenshots & Demo

<details>
<summary>📱 WeChat Mini Program UI</summary>

- **Chat Interface**: Clean message bubbles with user (right/green) and AI (left/white)
- **Input Area**: Multi-modal input with text, voice, and image support
- **Floating Menu**: Chinese-style action button with share and settings
- **Professional Branding**: Custom "Anda Digital" (安达数字) logo suite

</details>

<details>
<summary>🔧 Backend Features</summary>

- **Real-time Streaming**: Token-by-token response via WebSocket
- **Session Management**: Automatic cleanup and thread-safe operations  
- **Health Monitoring**: Runtime metrics and system status
- **Error Handling**: Comprehensive error management and recovery

</details>

## 🛠️ Development

### 🧪 Testing

```bash
# Backend tests
cd csdeepseek/backend
go test ./...

# Frontend testing in WeChat Developer Tools
# Use the built-in simulator and debugging tools
```

### 🔧 Building for Production

```bash
# Backend build
cd csdeepseek/backend
go build -o csdeepseek

# Frontend deployment
# Upload through WeChat Developer Tools
# or use WeChat CI/CD tools
```

## 🌟 Key Highlights

### 💡 What Makes This Special

1. **Production Quality** - Both frontend and backend are production-ready with proper error handling
2. **Best Practices** - Follows WeChat Mini Program guidelines and Go development standards
3. **Cultural Optimization** - Designed specifically for Chinese market with proper UX patterns
4. **Dual Communication** - Supports both traditional HTTP and modern WebSocket streaming
5. **Complete Solution** - End-to-end implementation from UI to AI integration

### 🎯 Perfect For

- **Learning WeChat Mini Program development** with modern patterns
- **Understanding Go backend architecture** for AI applications  
- **Implementing chat interfaces** with proper UX considerations
- **DeepSeek LLM integration** examples and best practices
- **Production deployment** reference for real applications

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests if applicable
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### 📋 Development Guidelines

- Follow existing code style and patterns
- Add tests for new functionality
- Update documentation for API changes
- Ensure WeChat Mini Program compliance
- Test on multiple devices/simulators

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **DeepSeek** for providing excellent LLM capabilities
- **WeChat Team** for the comprehensive Mini Program platform
- **Go Community** for excellent libraries and tools
- **Open Source Community** for inspiration and best practices

## 📞 Support

- **Documentation**: Check this README and code comments
- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

---

<div align="center">

**⭐ If this project helped you, please give it a star! ⭐**

Made with ❤️ for the developer community

</div> 