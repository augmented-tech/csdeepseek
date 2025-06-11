import { storage, KEYS } from './utils/storage/storage';
// app.js
import chatService from './services/chat/chat';
import lazyLoader from './utils/lazyload/lazyload';

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

    // Enable lazy loader debug mode for development (set to false for production)
    // lazyLoader.setDebugMode(true);

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

  onHide() {
    // Clean up lazy loader when app goes to background
    console.log('App hidden, cleaning up lazy loader');
  },

  onUnload() {
    // Clean up lazy loader resources
    lazyLoader.destroy();
  },
  generateSessionId() {
    // Use WeChat's system info and timestamp for better entropy
    const systemInfo = wx.getSystemInfoSync();
    const timestamp = Date.now();
    const randomPart = this.generateSecureRandom();
    
    // Combine multiple entropy sources
    const entropy = [
      timestamp,
      systemInfo.platform,
      systemInfo.model,
      systemInfo.pixelRatio,
      systemInfo.windowWidth,
      systemInfo.windowHeight,
      randomPart
    ].join('_');
    
    // Create a simple hash-like function for better distribution
    return 'session_' + this.simpleHash(entropy);
  },
  
  generateSecureRandom() {
    // Generate multiple random numbers and combine them
    let result = '';
    for (let i = 0; i < 4; i++) {
      // Use multiple calls to Math.random() and mix with timestamp
      const rand1 = Math.random();
      const rand2 = Math.random();
      const timeComponent = (Date.now() + i) % 1000000;
      const combined = (rand1 * rand2 * timeComponent).toString(36);
      result += combined.substr(2, 8);
    }
    return result;
  },
  
  simpleHash(str) {
    let hash = 0;
    if (str.length === 0) return hash.toString(36);
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to positive number and add timestamp for uniqueness
    const positiveHash = Math.abs(hash);
    const timestampSuffix = Date.now().toString(36);
    return positiveHash.toString(36) + '_' + timestampSuffix;
  }
}); 