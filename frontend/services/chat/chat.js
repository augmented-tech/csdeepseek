import api from '../api/api';
import wsChat from './ws_chat';
import Debug from '../../utils/debug/debug';

class UnifiedChatService {
  constructor() {
    this.messages = [];
    this.sessionId = '';
    this.useWebSocket = true; // Can be toggled at runtime
  }

  setMode(useWebSocket) {
    this.useWebSocket = useWebSocket;
    if (!useWebSocket) {
      wsChat.close(); // Close WebSocket connection when switching to HTTP
    }
  }

  async sendMessage(contentOrOptions) {
    if (this.useWebSocket) {
      // WebSocket mode
      const { sessionId, message, onToken, onDone, onError } = contentOrOptions;
      this.sessionId = sessionId;
      
      // Add user message
      const userMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };
      this.messages.push(userMessage);

      // Send via WebSocket
      wsChat.sendMessage({
        sessionId,
        message,
        onToken: (token) => {
          if (onToken) onToken(token);
        },
        onDone: () => {
          if (onDone) onDone();
        },
        onError: (err) => {
          if (onError) onError(err);
        }
      });
    } else {
      // HTTP mode
      try {
        const content = contentOrOptions;
        // Add user message
        const userMessage = {
          role: 'user',
          content,
          timestamp: new Date().toISOString()
        };
        this.messages.push(userMessage);

        // Get response from API
        const response = await api.chat.send(content);
        // Store session ID from response
        if (response.session_id) {
          this.sessionId = response.session_id;
        }
        
        const assistantMessage = {
          role: 'assistant',
          content: response.message,
          timestamp: new Date().toISOString()
        };
        this.messages.push(assistantMessage);

        return {
          userMessage,
          assistantMessage
        };
      } catch (error) {
        Debug.error('Error sending message:', error);
        throw error;
      }
    }
  }

  getMessages() {
    return this.messages;
  }

  clearMessages() {
    this.messages = [];
    this.sessionId = ''; // Clear session ID when clearing messages
    if (this.useWebSocket) {
      wsChat.close();
    }
  }
}

// Export a singleton instance
const chatService = new UnifiedChatService();
export default chatService;

/**
 * Usage:
 * import chatService from './chat';
 * 
 * // Switch modes at runtime
 * chatService.setMode(true); // Use WebSocket
 * chatService.setMode(false); // Use HTTP
 * 
 * // HTTP mode
 * const { userMessage, assistantMessage } = await chatService.sendMessage('Hello');
 * 
 * // WebSocket mode
 * chatService.sendMessage({
 *   sessionId, message,
 *   onToken: (token) => { ... },
 *   onDone: () => { ... },
 *   onError: (err) => { ... }
 * });
 */ 