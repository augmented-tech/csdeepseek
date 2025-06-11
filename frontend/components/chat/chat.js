Component({
  properties: {
    messages: {
      type: Array,
      value: []
    }
  },

  data: {
    scrollTop: 0
  },

  methods: {
    onScrollToBottom() {
      const query = wx.createSelectorQuery().in(this);
      query.select('.chat-container').boundingClientRect();
      query.exec((res) => {
        if (res[0]) {
          this.setData({
            scrollTop: res[0].height
          });
        }
      });
    },

    onMessageTap(e) {
      const { index } = e.currentTarget.dataset;
      const message = this.data.messages[index];
      this.triggerEvent('messageTap', { message });
    }
  },

  observers: {
    'messages': function(messages) {
      if (messages && messages.length > 0) {
        this.onScrollToBottom();
      }
    }
  }
}); 