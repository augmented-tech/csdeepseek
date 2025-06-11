# DeepSeek Chat Mini Program

A WeChat Mini Program for interacting with the DeepSeek AI assistant.

## Features

- Real-time chat interface
- Multi-modal input support
- Session management
- Offline support
- Error handling
- Loading states

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

## Development

1. Install [WeChat Developer Tools](https://developers.weixin.qq.com/miniprogram/en/dev/devtools/download.html)
2. Clone this repository
3. Open the project in WeChat Developer Tools
4. Update `project.config.json` with your appid
5. Start developing!

## API Integration

The Mini Program integrates with the DeepSeek API for chat completions. Update the `BASE_URL` in `services/api/api.js` to point to your API endpoint.

## Storage

The Mini Program uses WeChat's storage API for:
- User information
- Chat history
- Session management

## Styling

The Mini Program uses WeChat's WXSS for styling, with a focus on:
- Clean, minimalist interface
- Fast response times
- Clear visual hierarchy
- Intuitive navigation
- Error prevention
- Consistent styling

## License

MIT 