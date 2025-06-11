/**
 * Lazy Loading Utility for WeChat Mini Program
 * Handles component, image, and data lazy loading
 */

class LazyLoader {
  constructor() {
    this.loadedComponents = new Set();
    this.imageObserver = null;
    this.componentQueue = [];
    this.debugMode = false; // Set to true for verbose logging
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
    if (this.debugMode) {
      console.log(`[LazyLoader] Component loaded: ${componentName}`);
    }
  }

  /**
   * Lazy load images when they enter viewport
   * @param {string} selector - CSS selector for images to lazy load
   * @param {Object} context - Page or component context
   */
  initImageLazyLoad(selector = '.lazy-image', context) {
    if (!context) return;

    // Check if there are any elements matching the selector first
    const query = wx.createSelectorQuery().in(context);
          query.selectAll(selector).boundingClientRect((rects) => {
        if (!rects || rects.length === 0) {
          if (this.debugMode) {
            console.log(`[LazyLoader] No elements found for selector "${selector}". Skipping image lazy loading.`);
          }
          return;
        }

        if (this.debugMode) {
          console.log(`[LazyLoader] Found ${rects.length} elements for lazy loading with selector "${selector}"`);
        }

        // Create intersection observer for images only if elements exist
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
    }).exec();
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
         console.error('[LazyLoader] Image lazy load failed:', err);
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
       console.error('[LazyLoader] Data lazy load failed:', error);
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
       if (this.debugMode) {
         console.error('[LazyLoader] Cache read error:', e);
       }
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
       if (this.debugMode) {
         console.error('[LazyLoader] Cache write error:', e);
       }
     }
  }

  /**
   * Check if elements exist before initializing lazy loading
   * @param {string} selector - CSS selector to check
   * @param {Object} context - Page or component context
   * @returns {Promise<boolean>} - True if elements exist
   */
  async checkElementsExist(selector, context) {
    return new Promise((resolve) => {
      const query = wx.createSelectorQuery().in(context);
      query.selectAll(selector).boundingClientRect((rects) => {
        resolve(rects && rects.length > 0);
      }).exec();
    });
  }

  /**
   * Initialize lazy loading only if elements exist
   * @param {string} selector - CSS selector for images to lazy load
   * @param {Object} context - Page or component context
   */
  async initImageLazyLoadSafe(selector = '.lazy-image', context) {
    const elementsExist = await this.checkElementsExist(selector, context);
    if (elementsExist) {
      this.initImageLazyLoad(selector, context);
         } else {
       if (this.debugMode) {
         console.log(`[LazyLoader] No elements found for "${selector}". Image lazy loading skipped.`);
       }
     }
  }

  /**
   * Enable or disable debug logging
   * @param {boolean} enabled - Enable debug mode
   */
  setDebugMode(enabled) {
    this.debugMode = enabled;
    if (enabled) {
      console.log('[LazyLoader] Debug mode enabled');
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