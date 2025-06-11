Component({
  properties: {
    content: {
      type: String,
      value: ''
    },
    role: {
      type: String,
      value: 'assistant' // 'user' or 'assistant'
    },
    isStreaming: {
      type: Boolean,
      value: false
    },
    timestamp: {
      type: String,
      value: ''
    }
  }
}); 