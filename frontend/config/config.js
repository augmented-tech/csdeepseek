// Central configuration for the WeChat Mini Program
// Update these URLs based on your deployment environment

const CONFIG = {
  // Backend API Configuration
  API: {
    BASE_URL: 'http://localhost:7071/api',  // Local development
    // BASE_URL: 'https://your-production-domain.com/api',  // Production
    
    // WebSocket Configuration
    WS_URL: 'ws://localhost:7071/ws/chat',  // Local development WebSocket
    // WS_URL: 'wss://your-production-domain.com/ws/chat',  // Production WebSocket (secure)
  },
  
  // External API Configuration (if needed)
  EXTERNAL: {
    DEEPSEEK_BASE_URL: 'https://api.deepseek.com/v1',
  },
  
  // App Configuration
  APP: {
    VERSION: '1.0.0',
    DEBUG_MODE: true,  // Set to false for production
    SESSION_TIMEOUT: 30 * 60 * 1000,  // 30 minutes in milliseconds
  },
  
  // Chat Configuration
  CHAT: {
    MAX_MESSAGE_LENGTH: 2000,
    TYPING_INDICATOR_DELAY: 500,
    RECONNECT_ATTEMPTS: 3,
    RECONNECT_DELAY: 2000,
  }
};

// Helper function to get the appropriate URL based on environment
CONFIG.getApiUrl = function() {
  return this.API.BASE_URL;
};

CONFIG.getWebSocketUrl = function() {
  return this.API.WS_URL;
};

// Export for use in other modules
export default CONFIG; 