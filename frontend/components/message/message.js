Component({
  properties: {
    content: {
      type: String,
      value: ''
    },
    role: {
      type: String,
      value: 'user' // 'user' or 'assistant'
    },
    timestamp: {
      type: String,
      value: ''
    },
    isTyping: {
      type: Boolean,
      value: false
    },
    hasError: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', {
        content: this.data.content,
        role: this.data.role,
        timestamp: this.data.timestamp
      });
    },
    onRetry() {
      this.triggerEvent('retry', {
        content: this.data.content,
        role: this.data.role,
        timestamp: this.data.timestamp
      });
    }
  }
}); 