import { storage, KEYS } from './utils/storage/storage';
// app.js
import chatService from './services/chat/chat';

App({
  globalData: {
    userInfo: null,
    sessionId: null,
    apiBaseUrl: 'http://localhost:7071/api'
  },
  onLaunch() {
    // Initialize the app
    console.log('App launched');
    
    // Enable web sockets
    chatService.setMode(true); // Enable WebSocket mode globally

    // Generate or retrieve session ID
    let sessionId = storage.get(KEYS.SESSION_ID);
    if (!sessionId) {
      sessionId = this.generateSessionId();
      storage.set(KEYS.SESSION_ID, sessionId);
    }
    this.globalData.sessionId = sessionId;
    // Report app launch analytics
    wx.reportAnalytics('app_launch', { sessionId });
  },
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}); 