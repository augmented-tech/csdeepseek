# DeepSeek Chat Mini Program

A WeChat Mini Program for interacting with the DeepSeek AI assistant.

# DeepSeek 聊天小程序

一个用于与 DeepSeek AI 助手交互的微信小程序。

## Features

- Real-time chat interface
- Multi-modal input support
- Session management
- Offline support
- Error handling
- Loading states

## 功能特点

- 实时聊天界面
- 多模态输入支持
- 会话管理
- 离线支持
- 错误处理
- 加载状态

## Project Structure

```
frontend/
├── assets/           # Images and resources
├── components/       # Reusable components
│   ├── chat/        # Chat component
│   ├── input/       # Input component
│   └── message/     # Message component
├── pages/           # Page components
│   ├── chat/        # Chat page
│   └── index/       # Index page
├── services/        # API services
│   ├── api/         # API client
│   └── chat/        # Chat service
├── utils/           # Utility functions
│   ├── request/     # Request utilities
│   └── storage/     # Storage utilities
├── app.js           # App entry point
├── app.json         # App configuration
├── app.wxss         # App styles
├── project.config.json  # Project configuration
└── sitemap.json     # Sitemap configuration
```

## 项目结构

```
frontend/
├── assets/           # 图片和资源
├── components/       # 可复用组件
│   ├── chat/        # 聊天组件
│   ├── input/       # 输入组件
│   └── message/     # 消息组件
├── pages/           # 页面组件
│   ├── chat/        # 聊天页面
│   └── index/       # 首页
├── services/        # API 服务
│   ├── api/         # API 客户端
│   └── chat/        # 聊天服务
├── utils/           # 工具函数
│   ├── request/     # 请求工具
│   └── storage/     # 存储工具
├── app.js           # 应用入口点
├── app.json         # 应用配置
├── app.wxss         # 应用样式
├── project.config.json  # 项目配置
└── sitemap.json     # 站点地图配置
```

## Development

1. Install [WeChat Developer Tools](https://developers.weixin.qq.com/miniprogram/en/dev/devtools/download.html)
2. Clone this repository
3. Open the project in WeChat Developer Tools
4. Update `project.config.json` with your appid
5. Start developing!

## 开发

1. 安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 克隆此仓库
3. 在微信开发者工具中打开项目
4. 在 `project.config.json` 中更新你的 appid
5. 开始开发！

## API Integration

The Mini Program integrates with the DeepSeek API for chat completions. Update the `BASE_URL` in `services/api/api.js` to point to your API endpoint.

## API 集成

小程序集成了 DeepSeek API 用于聊天补全。在 `services/api/api.js` 中更新 `BASE_URL` 指向你的 API 端点。

## Storage

The Mini Program uses WeChat's storage API for:
- User information
- Chat history
- Session management

## 存储

小程序使用微信的存储 API 用于：
- 用户信息
- 聊天历史
- 会话管理

## Styling

The Mini Program uses WeChat's WXSS for styling, with a focus on:
- Clean, minimalist interface
- Fast response times
- Clear visual hierarchy
- Intuitive navigation
- Error prevention
- Consistent styling

## 样式

小程序使用微信的 WXSS 进行样式设计，重点关注：
- 简洁、极简的界面
- 快速响应时间
- 清晰的视觉层次
- 直观的导航
- 错误预防
- 一致的样式

## License

MIT

## 许可证

MIT 