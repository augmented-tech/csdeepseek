import chatService from '../../services/chat/chat';
import { storage, KEYS } from '../../utils/storage/storage';
import { formatTime } from '../../utils/request/request';
import lazyLoader from '../../utils/lazyload/lazyload';
import Debug from '../../utils/debug/debug';

Page({
  data: {
    messages: [],
    currentAssistantMessage: '',
    loading: false,
    sessionId: '', // get from globalData or storage if needed
    useWebSocket: true, // can be toggled in settings
    scrollToId: '',
    // Floating button drag state
    isDragging: false,
    floatingBtnX: null, // Will be set to default position
    floatingBtnY: null, // Will be set to default position
    dragStartX: 0,
    dragStartY: 0,
    dragStartBtnX: 0,
    dragStartBtnY: 0
  },

  onLoad() {
    // Initialize floating button position
    this.initFloatingButtonPosition();
    
    // Load chat history from storage
    const history = storage.get(KEYS.CHAT_HISTORY) || [];
    this.setData({ messages: history });
    
    // Set initial mode
    chatService.setMode(this.data.useWebSocket);
    
    // Scroll to bottom after loading messages
    if (history.length > 0) {
      this.scrollToBottom();
    }
    
    // Initialize lazy loading after a shorter delay
    setTimeout(() => {
      this.initLazyLoading();
    }, 200);
  },

  initFloatingButtonPosition() {
    // Get window info to calculate default position
    const windowInfo = wx.getWindowInfo();
    const screenWidth = windowInfo.screenWidth;
    const screenHeight = windowInfo.screenHeight;
    
    // Convert px to rpx (750rpx = screenWidth px)
    const pxToRpx = 750 / screenWidth;
    
    // Try to load saved position first
    const savedPosition = wx.getStorageSync('floatingBtnPosition');
    
    if (savedPosition && savedPosition.x !== undefined && savedPosition.y !== undefined) {
      // Use saved position but ensure it's within screen bounds
      const buttonSize = 100; // rpx
      const margin = 20; // rpx margin from edges
      const maxX = 750 - buttonSize - margin;
      const maxY = (windowInfo.screenHeight * pxToRpx) - buttonSize - margin;
      
      const constrainedX = Math.max(margin, Math.min(savedPosition.x, maxX));
      const constrainedY = Math.max(margin, Math.min(savedPosition.y, maxY));
      
      this.setData({
        floatingBtnX: constrainedX,
        floatingBtnY: constrainedY
      });
    } else {
      // Default position: right: 30rpx, bottom: 200rpx
      // Convert to left and top coordinates
      const defaultRight = 30; // rpx
      const defaultBottom = 200; // rpx
      const buttonSize = 100; // rpx
      
      const defaultX = 750 - defaultRight - buttonSize; // Convert right to left
      const defaultY = (screenHeight * pxToRpx) - defaultBottom - buttonSize; // Convert bottom to top
      
      this.setData({
        floatingBtnX: defaultX,
        floatingBtnY: defaultY
      });
    }
  },

  // Floating button drag handlers
  onFloatingBtnTouchStart(e) {
    const touch = e.touches[0];
    this.dragStartTime = Date.now();
    this.dragStartX = touch.clientX;
    this.dragStartY = touch.clientY;
    this.dragStartBtnX = this.data.floatingBtnX;
    this.dragStartBtnY = this.data.floatingBtnY;
    this.hasMoved = false;
    
    // Don't set isDragging immediately - wait for actual movement
    this.setData({
      isDragging: false
    });
  },

  onFloatingBtnTouchMove(e) {
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - this.dragStartX);
    const deltaY = Math.abs(touch.clientY - this.dragStartY);
    const dragThreshold = 10; // pixels - minimum movement to start dragging
    
    // Only start dragging if user has moved beyond threshold
    if (!this.hasMoved && (deltaX > dragThreshold || deltaY > dragThreshold)) {
      this.hasMoved = true;
      this.setData({
        isDragging: true
      });
    }
    
    // Only update position if we're actually dragging
    if (this.hasMoved) {
      const windowInfo = wx.getWindowInfo();
      const pxToRpx = 750 / windowInfo.screenWidth;
      
      // Calculate new position
      const totalDeltaX = (touch.clientX - this.dragStartX) * pxToRpx;
      const totalDeltaY = (touch.clientY - this.dragStartY) * pxToRpx;
      
      let newX = this.dragStartBtnX + totalDeltaX;
      let newY = this.dragStartBtnY + totalDeltaY;
      
      // Constrain to screen boundaries
      const buttonSize = 100; // rpx
      const margin = 20; // rpx margin from edges
      const maxX = 750 - buttonSize - margin;
      const maxY = (windowInfo.screenHeight * pxToRpx) - buttonSize - margin;
      
      newX = Math.max(margin, Math.min(newX, maxX));
      newY = Math.max(margin, Math.min(newY, maxY));
      
      this.setData({
        floatingBtnX: newX,
        floatingBtnY: newY
      });
    }
  },

  onFloatingBtnTouchEnd(e) {
    const wasDragging = this.data.isDragging;
    
    this.setData({
      isDragging: false
    });
    
    // Only save position if user actually dragged
    if (wasDragging && this.hasMoved) {
      wx.setStorageSync('floatingBtnPosition', {
        x: this.data.floatingBtnX,
        y: this.data.floatingBtnY
      });
    }
    
    // Store drag state to prevent menu opening if user was dragging
    this.justFinishedDragging = wasDragging && this.hasMoved;
    setTimeout(() => {
      this.justFinishedDragging = false;
    }, 150);
  },

  async initLazyLoading() {
    try {
      // Initialize image lazy loading only if we have images
      // For chat page, we might add avatar images or shared images later
      setTimeout(async () => {
        await lazyLoader.initImageLazyLoadSafe('.lazy-image', this);
      }, 100); // Shorter wait for DOM to be ready
      
      // Lazy load components that aren't immediately visible
      lazyLoader.loadComponent('chat-components', () => {
        // Chat components loaded successfully
      });
         } catch (error) {
       Debug.error('[Chat] Lazy loading initialization error:', error);
     }
  },

  async loadChatHistory() {
    // Show skeleton loading state
    this.setData({ 
      loading: true,
      messages: [] 
    });

    try {
      // Simulate lazy loading of chat history
      const history = await lazyLoader.loadData(
        () => {
          return new Promise(resolve => {
            setTimeout(() => {
              const data = storage.get(KEYS.CHAT_HISTORY) || [];
              resolve(data);
            }, 50); // Minimal delay to show loading state
          });
        },
        'chat_history'
      );

      this.setData({ 
        messages: history,
        loading: false 
      });

      // Scroll to bottom after loading messages
      if (history.length > 0) {
        this.scrollToBottom();
      }
    } catch (error) {
      Debug.error('Failed to load chat history:', error);
      this.setData({ loading: false });
    }
  },

  onShow() {
    // Setup share menu and other options
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  onShareAppMessage() {
    return {
      title: 'DeepSeek Chat - AI Assistant',
      path: '/pages/chat/chat',
      imageUrl: '/assets/images/chat_share.svg' // Share image for DeepSeek Chat
    };
  },

  // Menu options when user taps the menu button
  onMenuButtonTap() {
    // Don't open menu if user just finished dragging
    if (this.justFinishedDragging) {
      return;
    }
    
    const that = this;
    wx.showActionSheet({
      itemList: [
        'Clear Chat History',
        'Switch to ' + (this.data.useWebSocket ? 'HTTP' : 'WebSocket') + ' Mode',
        'Share Chat',
        'About'
      ],
      success: function(res) {
        switch(res.tapIndex) {
          case 0:
            that.clearChat();
            break;
          case 1:
            that.toggleMode();
            break;
          case 2:
            that.shareChat();
            break;
          case 3:
            that.showAbout();
            break;
        }
      }
    });
  },

  shareChat() {
    const that = this;
    
    // If no messages, just share the mini-program
    if (this.data.messages.length === 0) {
      wx.showShareMenu({
        withShareTicket: true
      });
      return;
    }

    // Show options for sharing
    wx.showActionSheet({
      itemList: [
        'Share Mini-Program',
        'Copy Chat Summary',
        'Share Last Answer'
      ],
      success: function(res) {
        switch(res.tapIndex) {
          case 0:
            // Share the mini-program
            wx.showShareMenu({
              withShareTicket: true
            });
            break;
          case 1:
            // Copy chat summary to clipboard
            that.copyChatSummary();
            break;
          case 2:
            // Share the last assistant response
            that.shareLastAnswer();
            break;
        }
      }
    });
  },

  copyChatSummary() {
    if (this.data.messages.length === 0) {
      wx.showToast({
        title: 'No messages to share',
        icon: 'none'
      });
      return;
    }

    // Create a summary of the conversation
    let summary = '💬 DeepSeek Chat Summary\n\n';
    this.data.messages.slice(-3).forEach((msg, index) => {
      const prefix = msg.role === 'user' ? '👤 You: ' : '🤖 AI: ';
      const content = msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : '');
      summary += prefix + content + '\n\n';
    });
    
    summary += '🔗 Generated by DeepSeek Chat Mini-Program';

    wx.setClipboardData({
      data: summary,
      success: () => {
        wx.showToast({
          title: 'Chat summary copied!',
          icon: 'success'
        });
      }
    });
  },

  shareLastAnswer() {
    const lastMessage = this.data.messages[this.data.messages.length - 1];
    
    if (!lastMessage || lastMessage.role !== 'assistant') {
      wx.showToast({
        title: 'No AI response to share',
        icon: 'none'
      });
      return;
    }

    const shareText = `🤖 AI Response:\n\n${lastMessage.content}\n\n🔗 From DeepSeek Chat`;
    
    wx.setClipboardData({
      data: shareText,
      success: () => {
        wx.showToast({
          title: 'AI response copied!',
          icon: 'success',
          duration: 2000
        });
        
        // Show hint about sharing
        setTimeout(() => {
          wx.showToast({
            title: 'You can now paste and share!',
            icon: 'none',
            duration: 2000
          });
        }, 2500);
      }
    });
  },

  showAbout() {
    wx.showModal({
      title: 'About DeepSeek Chat',
      content: 'DeepSeek Chat is an AI-powered assistant. Version 1.0\n\nDeveloped for WeChat Mini-Program platform.',
      showCancel: false,
      confirmText: 'OK'
    });
  },

  onUnload() {
    // Save chat history to storage
    storage.set(KEYS.CHAT_HISTORY, this.data.messages);
    
    // Clean up lazy loader for this page
    lazyLoader.destroy();
  },

  // Helper method to ensure smooth scrolling to bottom - IMPROVED
  scrollToBottom() {
    // Clear any existing scroll timeout
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    // Use timeout to ensure DOM has updated
    this.scrollTimeout = setTimeout(() => {
      this.setData({ scrollToId: 'bottom-anchor' });
      
      // Additional scroll after a longer delay to catch any final content
      setTimeout(() => {
        this.setData({ scrollToId: '' });
        setTimeout(() => {
          this.setData({ scrollToId: 'bottom-anchor' });
        }, 50);
      }, 200); // Reduced from 300ms to 200ms for faster response
    }, 100);
  },

  async onSend(e) {
    const content = e.detail.content;
    if (!content || !content.trim()) return;
    this.setData({ loading: true, currentAssistantMessage: '' });

    if (this.data.useWebSocket) {
      // WebSocket mode
      const userMsg = { role: 'user', content };
      this.data.messages.push(userMsg);
      this.setData({ messages: this.data.messages });
      this.scrollToBottom();
      storage.set(KEYS.CHAT_HISTORY, this.data.messages);

      chatService.sendMessage({
        sessionId: this.data.sessionId,
        message: content,
        onToken: (token) => {
          this.setData({
            currentAssistantMessage: this.data.currentAssistantMessage + token
          });
          this.scrollToBottom();
        },
        onDone: () => {
          const assistantMsg = { role: 'assistant', content: this.data.currentAssistantMessage };
          this.data.messages.push(assistantMsg);
          this.setData({ messages: this.data.messages, currentAssistantMessage: '', loading: false });
          this.scrollToBottom();
          storage.set(KEYS.CHAT_HISTORY, this.data.messages);
        },
        onError: (err) => {
          wx.showToast({ title: err, icon: 'none' });
          this.setData({ loading: false, currentAssistantMessage: '' });
          this.scrollToBottom();
        }
      });
    } else {
      // HTTP mode
      chatService.sendMessage(content)
        .then(({ userMessage, assistantMessage }) => {
          this.data.messages.push(userMessage, assistantMessage);
          this.setData({ 
            messages: this.data.messages,
            loading: false
          });
          this.scrollToBottom();
          storage.set(KEYS.CHAT_HISTORY, this.data.messages);
        })
        .catch((err) => {
          wx.showToast({ title: err.message || 'Failed to send message', icon: 'none' });
          this.setData({ loading: false });
          this.scrollToBottom();
        });
    }
  },

  handleMessageTap(e) {
    const { message } = e.detail;
    // Handle message tap (e.g., copy to clipboard)
    wx.setClipboardData({
      data: message.content,
      success: () => {
        wx.showToast({
          title: 'Copied to clipboard',
          icon: 'success'
        });
      }
    });
  },

  clearChat() {
    wx.showModal({
      title: 'Clear Chat',
      content: 'Are you sure you want to clear all messages?',
      success: (res) => {
        if (res.confirm) {
          chatService.clearMessages();
          this.setData({ messages: [] });
          storage.remove(KEYS.CHAT_HISTORY);
          // Clear session ID from global data
          const app = getApp();
          app.globalData.sessionId = '';
          wx.reportAnalytics('chat_cleared', {});
        }
      }
    });
  },

  toggleMode() {
    const newMode = !this.data.useWebSocket;
    this.setData({ useWebSocket: newMode });
    chatService.setMode(newMode);
    wx.showToast({
      title: `Switched to ${newMode ? 'WebSocket' : 'HTTP'} mode`,
      icon: 'none'
    });
  }
}); 