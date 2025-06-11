const BASE_URL = 'http://localhost:7071';

const request = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      ...options,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || 'Request failed'));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

const api = {
  chat: {
    send: (message) => {
      const app = getApp();
      const sessionId = app.globalData.sessionId || '';
      return request('/api/chat', {
        method: 'POST',
        data: {
          session_id: sessionId,
          message: message
        }
      }).then(response => {
        // Store the session ID for future requests
        if (response.session_id) {
          app.globalData.sessionId = response.session_id;
        }
        return response;
      });
    }
  }
};

export default api; 