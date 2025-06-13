# Configuration

This directory contains the centralized configuration for the WeChat Mini Program.

## Files

- `config.js` - Main configuration file containing all API URLs and app settings

## Usage

Import the config in any service or component:

```javascript
import CONFIG from '../config/config';

// Use API URL
const apiUrl = CONFIG.getApiUrl();

// Use WebSocket URL  
const wsUrl = CONFIG.getWebSocketUrl();

// Access other settings
const debugMode = CONFIG.APP.DEBUG_MODE;
const maxMessageLength = CONFIG.CHAT.MAX_MESSAGE_LENGTH;
```

## Environment Configuration

To switch between development and production:

1. Open `config/config.js`
2. Comment out the development URLs
3. Uncomment and update the production URLs

```javascript
// Development
// BASE_URL: 'http://localhost:7071/api',
// WS_URL: 'ws://localhost:7071/ws/chat',

// Production  
BASE_URL: 'https://your-production-domain.com/api',
WS_URL: 'wss://your-production-domain.com/ws/chat',
```

## Benefits

- **Single source of truth** - All URLs in one place
- **Easy deployment** - Change URLs in one file only
- **Environment switching** - Simple toggle between dev/prod
- **Type safety** - Centralized configuration structure
- **Additional settings** - Chat limits, timeouts, etc.

## Services Using This Config

- `services/api/api.js` - HTTP API requests
- `services/chat/ws_chat.js` - WebSocket connections  
- `utils/request/request.js` - External API requests
- `app.js` - Global app configuration 