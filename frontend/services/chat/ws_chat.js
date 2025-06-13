// WebSocket streaming chat service for DeepSeek

const WS_URL = 'wss://localhost:7071/ws/chat'; // Azure production backend

class WSChatService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.queue = [];
    this.onTokenCallback = null;
    this.onDoneCallback = null;
    this.onErrorCallback = null;
    this.sessionId = '';
  }

  connect() {
    if (this.isConnected) return;
    this.socket = wx.connectSocket({ url: WS_URL });
    this.socket.onOpen(() => {
      this.isConnected = true;
      // Send any queued messages
      this.queue.forEach((msg) => this.socket.send({ data: msg }));
      this.queue = [];
    });
    this.socket.onMessage((res) => {
      try {
        const data = JSON.parse(res.data);
        if (data.type === 'token' && this.onTokenCallback) {
          this.onTokenCallback(data.content);
        } else if (data.type === 'done' && this.onDoneCallback) {
          this.onDoneCallback();
        } else if (data.type === 'error' && this.onErrorCallback) {
          this.onErrorCallback(data.content);
        }
      } catch (e) {
        if (this.onErrorCallback) this.onErrorCallback('Invalid message format');
      }
    });
    this.socket.onClose(() => {
      this.isConnected = false;
    });
    this.socket.onError(() => {
      this.isConnected = false;
      if (this.onErrorCallback) this.onErrorCallback('WebSocket error');
    });
  }

  sendMessage({ sessionId, message, onToken, onDone, onError }) {
    this.onTokenCallback = onToken;
    this.onDoneCallback = onDone;
    this.onErrorCallback = onError;
    this.sessionId = sessionId;
    const payload = JSON.stringify({ session_id: sessionId, message });
    if (this.isConnected && this.socket) {
      this.socket.send({ data: payload });
    } else {
      this.queue.push(payload);
      this.connect();
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
      this.isConnected = false;
    }
  }
}

export default new WSChatService(); 