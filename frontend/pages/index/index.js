Page({
  data: {
    userInfo: null,
    hasUserInfo: false
  },

  onLoad() {
    // Check if we have user info
    const app = getApp()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },

  // Navigate to chat page
  goToChat() {
    wx.navigateTo({
      url: '/pages/chat/chat'
    })
  },

  onStartChat() {
    wx.navigateTo({
      url: '/pages/chat/chat'
    });
  }
}) 