/**
 * Lazy Loading Utility for WeChat Mini Program
 * Handles component, image, and data lazy loading
 */

class LazyLoader {
  constructor() {
    this.loadedComponents = new Set();
    this.imageObserver = null;
    this.componentQueue = [];
  }

  /**
   * Lazy load component when needed
   * @param {string} componentName - Name of the component
   * @param {Function} loadCallback - Callback when component is loaded
   */
  loadComponent(componentName, loadCallback) {
    if (this.loadedComponents.has(componentName)) {
      loadCallback && loadCallback();
      return;
    }

    // Add to component queue
    this.componentQueue.push({
      name: componentName,
      callback: loadCallback,
      timestamp: Date.now()
    });

    // Simulate component loading (WeChat handles this automatically with lazyCodeLoading)
    setTimeout(() => {
      this.markComponentLoaded(componentName);
      loadCallback && loadCallback();
    }, 100);
  }

  /**
   * Mark component as loaded
   * @param {string} componentName 
   */
  markComponentLoaded(componentName) {
    this.loadedComponents.add(componentName);
    console.log(`Component loaded: ${componentName}`);
  }

  /**
   * Lazy load images when they enter viewport
   * @param {string} selector - CSS selector for images to lazy load
   * @param {Object} context - Page or component context
   */
  initImageLazyLoad(selector = '.lazy-image', context) {
    if (!context) return;

    // Create intersection observer for images
    this.imageObserver = context.createIntersectionObserver({
      relativeToViewport: true,
      margins: {
        top: 100,
        bottom: 100,
        left: 0,
        right: 0
      }
    });

    this.imageObserver.observe(selector, (res) => {
      res.forEach(item => {
        if (item.intersectionRatio > 0) {
          // Image is in viewport, trigger loading
          const dataset = item.dataset;
          if (dataset.src && !dataset.loaded) {
            this.loadImage(item.id, dataset.src, context);
          }
        }
      });
    });
  }

  /**
   * Load image and update component data
   * @param {string} imageId - ID of the image element
   * @param {string} src - Image source URL
   * @param {Object} context - Page or component context
   */
  loadImage(imageId, src, context) {
    // Preload image
    wx.downloadFile({
      url: src,
      success: (res) => {
        if (res.statusCode === 200) {
          // Update image source in component data
          const updateKey = `images.${imageId}`;
          context.setData({
            [updateKey]: {
              src: res.tempFilePath,
              loaded: true,
              loading: false
            }
          });
        }
      },
      fail: (err) => {
        console.error('Image lazy load failed:', err);
        // Set fallback or error state
        const updateKey = `images.${imageId}`;
        context.setData({
          [updateKey]: {
            src: '/assets/images/placeholder.png',
            loaded: false,
            loading: false,
            error: true
          }
        });
      }
    });
  }

  /**
   * Lazy load data when component becomes visible
   * @param {Function} dataLoader - Function that returns Promise
   * @param {string} cacheKey - Cache key for the data
   */
  async loadData(dataLoader, cacheKey) {
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const data = await dataLoader();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Data lazy load failed:', error);
      throw error;
    }
  }

  /**
   * Cache management
   */
  getFromCache(key) {
    try {
      const cached = wx.getStorageSync(`lazy_cache_${key}`);
      if (cached && cached.timestamp > Date.now() - 300000) { // 5 min cache
        return cached.data;
      }
    } catch (e) {
      console.error('Cache read error:', e);
    }
    return null;
  }

  setCache(key, data) {
    try {
      wx.setStorageSync(`lazy_cache_${key}`, {
        data,
        timestamp: Date.now()
      });
    } catch (e) {
      console.error('Cache write error:', e);
    }
  }

  /**
   * Cleanup resources
   */
  destroy() {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
      this.imageObserver = null;
    }
    this.componentQueue = [];
    this.loadedComponents.clear();
  }
}

// Singleton instance
const lazyLoader = new LazyLoader();

export default lazyLoader; 