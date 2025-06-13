# 🚀 CSDeepSeek - WeChat Mini Program AI Chat

> A production-ready WeChat Mini Program with Go backend showcasing modern AI chat implementation using DeepSeek LLM.

# 🚀 CSDeepSeek - 微信小程序 AI 聊天

> 一个生产就绪的微信小程序，使用 Go 后端，展示使用 DeepSeek LLM 的现代 AI 聊天实现。

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

## ✨ 功能特点

### 🎯 微信小程序（前端）
- **完美聊天界面** - 原生微信设计，包含消息气泡、动画和平滑滚动
- **多模态输入** - 支持文本、语音录制和图片上传
- **实时通信** - 支持 HTTP 和 WebSocket，实现灵活的后端集成
- **会话管理** - 持久化对话，清晰的历史记录功能
- **中国市场优化** - 浮动操作按钮、合适的字体和文化考虑
- **专业品牌** - 包含自定义 SVG 标志和资源

### ⚡ Go Backend API
- **DeepSeek Integration** - Complete LLM integration with streaming support
- **Dual API Modes** - REST endpoints + WebSocket streaming for real-time chat
- **Production Ready** - Health monitoring, graceful shutdown, error handling
- **Session Management** - Thread-safe session storage with automatic cleanup
- **Docker Support** - Multi-stage Docker builds for efficient deployment
- **Comprehensive Testing** - Unit tests and integration test examples

### ⚡ Go 后端 API
- **DeepSeek 集成** - 完整的 LLM 集成，支持流式传输
- **双 API 模式** - REST 端点 + WebSocket 流式传输，实现实时聊天
- **生产就绪** - 健康监控、优雅关闭、错误处理
- **会话管理** - 线程安全的会话存储，自动清理
- **Docker 支持** - 多阶段 Docker 构建，实现高效部署
- **全面测试** - 单元测试和集成测试示例

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

## 🏗️ 架构

```
csdeepseek/
├── 📱 frontend/          # 微信小程序
│   ├── pages/           # 聊天、设置和其他页面
│   ├── components/      # 可复用 UI 组件
│   ├── services/        # API 通信层
│   └── assets/          # 图片、图标和品牌资源
│
└── 🔧 backend/          # Go API 服务
    ├── api/             # HTTP 和 WebSocket 处理器
    ├── services/        # 业务逻辑（LLM、会话、向量）
    ├── models/          # 数据结构
    └── utils/           # 辅助函数
```

## 🚀 Quick Start

### Prerequisites
- [WeChat Developer Tools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- [Go 1.21+](https://golang.org/dl/)
- [Docker](https://www.docker.com/) (optional)
- DeepSeek API Key ([Get one here](https://platform.deepseek.com/))

## 🚀 快速开始

### 前置要求
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- [Go 1.21+](https://golang.org/dl/)
- [Docker](https://www.docker.com/)（可选）
- DeepSeek API 密钥（[在此获取](https://platform.deepseek.com/)）

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

### 🎯 前端设置（微信小程序）

1. **在微信开发者工具中打开**
   ```bash
   # 将前端目录作为新项目导入
   WeChat Developer Tools > 导入项目 > 选择：csdeepseek/frontend/
   ```

2. **配置 API 端点**
   ```javascript
   // 在 csdeepseek/frontend/services/api/api.js 中
   const BASE_URL = 'http://localhost:7071/api'  // 指向你的后端
   ```

3. **运行小程序**
   - 在微信开发者工具中点击"编译"
   - 在模拟器或真机上测试

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

### ⚡ 后端设置（Go API）

1. **安装依赖**
   ```bash
   cd csdeepseek/backend
   go mod tidy
   ```

2. **配置环境**
   ```bash
   cp env.example .env
   # 编辑 .env 并添加你的 DeepSeek API 密钥
   export DEEPSEEK_API_KEY=your_api_key_here
   ```

3. **本地运行**
   ```bash
   go run main.go
   # 服务器在 http://localhost:7071 启动
   ```

4. **或使用 Docker**
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

## 📚 API 文档

### 💬 聊天端点

#### HTTP 聊天
```http
POST /api/chat
Content-Type: application/json

{
    "session_id": "optional_session_id",
    "message": "Hello, how can you help me?"
}
```

#### WebSocket 流式聊天
```javascript
const ws = new WebSocket('ws://localhost:7071/ws/chat');
ws.send(JSON.stringify({
    session_id: "optional_session_id", 
    message: "Tell me about your services"
}));
```

#### 健康检查
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

## 🎨 截图和演示

<details>
<summary>📱 微信小程序界面</summary>

- **聊天界面**：清晰的消息气泡，用户（右侧/绿色）和 AI（左侧/白色）
- **输入区域**：支持文本、语音和图片的多模态输入
- **浮动菜单**：中国风格的操作按钮，包含分享和设置
- **专业品牌**：自定义"安达数字"标志套件

</details>

<details>
<summary>🔧 后端功能</summary>

- **实时流式传输**：通过 WebSocket 实现逐令牌响应
- **会话管理**：自动清理和线程安全操作
- **健康监控**：运行时指标和系统状态
- **错误处理**：全面的错误管理和恢复

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

## 🛠️ 开发

### 🧪 测试

```bash
# 后端测试
cd csdeepseek/backend
go test ./...

# 前端测试在微信开发者工具中
# 使用内置模拟器和调试工具
```

### 🔧 生产构建

```bash
# 后端构建
cd csdeepseek/backend
go build -o csdeepseek

# 前端部署
# 通过微信开发者工具上传
# 或使用微信 CI/CD 工具
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

## 🌟 主要亮点

### 💡 特色之处

1. **生产质量** - 前端和后端都具有生产就绪的错误处理
2. **最佳实践** - 遵循微信小程序指南和 Go 开发标准
3. **文化优化** - 专为中国市场设计，采用适当的 UX 模式
4. **双重通信** - 支持传统 HTTP 和现代 WebSocket 流式传输
5. **完整解决方案** - 从 UI 到 AI 集成的端到端实现

### 🎯 完美适用于

- **学习微信小程序开发**的现代模式
- **理解 AI 应用的 Go 后端架构**
- **实现具有适当 UX 考虑的聊天界面**
- **DeepSeek LLM 集成**示例和最佳实践
- **实际应用的生产部署**参考

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

## 🤝 贡献

我们欢迎贡献！以下是开始步骤：

1. **Fork 仓库**
2. **创建特性分支**：`git checkout -b feature/amazing-feature`
3. **进行更改**并添加测试（如适用）
4. **提交更改**：`git commit -m 'Add amazing feature'`
5. **推送到分支**：`git push origin feature/amazing-feature`
6. **创建 Pull Request**

### 📋 开发指南

- 遵循现有代码风格和模式
- 为新功能添加测试
- 更新 API 变更的文档
- 确保微信小程序合规性
- 在多个设备/模拟器上测试

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参见 [LICENSE](LICENSE) 文件。

## 🙏 Acknowledgments

- **DeepSeek** for providing excellent LLM capabilities
- **WeChat Team** for the comprehensive Mini Program platform
- **Go Community** for excellent libraries and tools
- **Open Source Community** for inspiration and best practices

## 🙏 致谢

- **DeepSeek** 提供出色的 LLM 能力
- **微信团队** 提供全面的小程序平台
- **Go 社区** 提供优秀的库和工具
- **开源社区** 提供灵感和最佳实践

## 📞 Support

- **Documentation**: Check this README and code comments
- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

## 📞 支持

- **文档**：查看本 README 和代码注释
- **问题**：使用 GitHub Issues 报告 bug 和功能请求
- **讨论**：使用 GitHub Discussions 提问和分享想法

---

<div align="center">

**⭐ If this project helped you, please give it a star! ⭐**

Made with ❤️ for the developer community

</div>

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给它一个星标！⭐**

为开发者社区而做 ❤️

</div> 