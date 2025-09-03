/* Constants */
export const CONSTANTS = {
  /* Breakpoints */
  MOBILE_BREAKPOINT: 768,
  /* Animation durations */
  ANIMATION_DURATION: 300,

  /* Aria attributes */
  ARIA: {
    EXPANDED: "aria-expanded",
  },
};

/* Configuration */
export const CONFIG = {};

/* DOM utilities */
export const DOM = {
  /* Get element by ID */
  getElementById(id) {
    const element = document.getElementById(id);
    if (!element && CONFIG.DEBUG) {
      console.warn(`Element with ID '${id}' not found`);
    }
    return element;
  },
};

/* Event utilities */
export const Events = {
  /* Add event listener */
  addEventListener(element, event, handler, options = {}) {
    if (element && typeof handler === "function") {
      element.addEventListener(event, handler, options);
    } else if (CONFIG.DEBUG) {
      console.warn("Invalid element or handler for event listener");
    }
  },

  /* Remove event listener */
  removeEventListener(element, event, handler) {
    if (element && typeof handler === "function") {
      element.removeEventListener(event, handler);
    }
  },
};

/* Utility helpers */
export const Utils = {
  /* Debounce function */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /* Debug logging */
  debug(message, data = null) {
    if (CONFIG.DEBUG) {
      console.log(`[DEBUG] ${message}`, data || "");
    }
  },

  /* Log general messages */
  logMessage(message) {
    console.log(`[GAME] ${message}`);
  },

  /* Format number with appropriate suffixes (K, M, B, etc.) */
  formatNumber(num) {
    if (num < 1000) return num.toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + "K";
    if (num < 1000000000) return (num / 1000000).toFixed(1) + "M";
    if (num < 1000000000000) return (num / 1000000000).toFixed(1) + "B";
    return (num / 1000000000000).toFixed(1) + "T";
  },
};

/* Initialization */

/* Initialize core functionality */
export function initializeCore() {
  Utils.debug("Core module initialized");

  /* Global error handling */
  window.addEventListener("error", (event) => {
    if (CONFIG.DEBUG) {
      console.error("Global error:", event.error);
    }
  });

  /* Unhandled promise rejection handling */
  window.addEventListener("unhandledrejection", (event) => {
    if (CONFIG.DEBUG) {
      console.error("Unhandled promise rejection:", event.reason);
    }
  });
}

/* Export default object */
export default {
  CONSTANTS,
  CONFIG,
  DOM,
  Events,
  Utils,
  initializeCore,
};
