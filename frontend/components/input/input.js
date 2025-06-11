Component({
  properties: {
    placeholder: {
      type: String,
      value: 'Type your message...'
    }
  },

  data: {
    inputValue: '',
    isRecording: false
  },

  methods: {
    onInput(e) {
      this.setData({
        inputValue: e.detail.value
      });
    },

    onSendTap() {
      const content = this.data.inputValue.trim();
      if (content) {
        this.triggerEvent('send', {
          content: content
        });
        this.setData({
          inputValue: ''
        });
      }
    },

    onVoiceTap() {
      if (this.data.isRecording) {
        wx.stopRecord({
          success: (res) => {
            this.setData({ isRecording: false });
            this.triggerEvent('voice', { tempFilePath: res.tempFilePath });
          },
          fail: (err) => {
            console.error('Voice recording failed:', err);
            this.setData({ isRecording: false });
          }
        });
      } else {
        this.setData({ isRecording: true });
        wx.startRecord({
          success: (res) => {
            this.setData({ isRecording: false });
            this.triggerEvent('voice', { tempFilePath: res.tempFilePath });
          },
          fail: (err) => {
            console.error('Voice recording failed:', err);
            this.setData({ isRecording: false });
          }
        });
      }
    },

    onImageTap() {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.triggerEvent('image', { tempFilePaths: res.tempFilePaths });
        },
        fail: (err) => {
          console.error('Image selection failed:', err);
        }
      });
    }
  }
}); 