const BASE_URL = 'https://api.deepseek.com/v1';

const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

const request = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');
    
    wx.request({
      url: `${BASE_URL}${url}`,
      ...options,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // Handle unauthorized
          wx.removeStorageSync('token');
          wx.navigateTo({
            url: '/pages/login/login'
          });
          reject(new Error('Unauthorized'));
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

export {
  request,
  formatTime
}; 