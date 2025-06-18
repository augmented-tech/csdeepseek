import CONFIG from '../../config/config';

/**
 * Debug utility that respects the DEBUG_MODE setting
 * Only logs to console when DEBUG_MODE is true
 */
class Debug {
  static log(...args) {
    if (CONFIG.APP.DEBUG_MODE) {
      console.log(...args);
    }
  }

  static error(...args) {
    if (CONFIG.APP.DEBUG_MODE) {
      console.error(...args);
    }
  }

  static warn(...args) {
    if (CONFIG.APP.DEBUG_MODE) {
      console.warn(...args);
    }
  }

  static info(...args) {
    if (CONFIG.APP.DEBUG_MODE) {
      console.info(...args);
    }
  }

  // Always show critical errors regardless of debug mode
  static critical(...args) {
    console.error('[CRITICAL]', ...args);
  }

  // Performance timing (only in debug mode)
  static time(label) {
    if (CONFIG.APP.DEBUG_MODE) {
      console.time(label);
    }
  }

  static timeEnd(label) {
    if (CONFIG.APP.DEBUG_MODE) {
      console.timeEnd(label);
    }
  }

  // Group logging for better organization
  static group(label) {
    if (CONFIG.APP.DEBUG_MODE) {
      console.group(label);
    }
  }

  static groupEnd() {
    if (CONFIG.APP.DEBUG_MODE) {
      console.groupEnd();
    }
  }
}

export default Debug; 