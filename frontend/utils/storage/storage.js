const KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  CHAT_HISTORY: 'chatHistory',
  SESSION_ID: 'sessionId'
};

const storage = {
  set(key, data) {
    try {
      wx.setStorageSync(key, data);
      return true;
    } catch (e) {
      console.error('Error setting storage:', e);
      return false;
    }
  },

  get(key) {
    try {
      return wx.getStorageSync(key);
    } catch (e) {
      console.error('Error getting storage:', e);
      return null;
    }
  },

  remove(key) {
    try {
      wx.removeStorageSync(key);
      return true;
    } catch (e) {
      console.error('Error removing storage:', e);
      return false;
    }
  },

  clear() {
    try {
      wx.clearStorageSync();
      return true;
    } catch (e) {
      console.error('Error clearing storage:', e);
      return false;
    }
  }
};

export {
  storage,
  KEYS
}; 