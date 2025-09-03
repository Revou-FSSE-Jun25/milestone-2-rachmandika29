/* Constants */
export const CONSTANTS = {
  /* Breakpoints */
  MOBILE_BREAKPOINT: 768,

  /* Aria attributes */
  ARIA: {
    EXPANDED: "aria-expanded",
  },
};

/* Debug configuration */
const DEBUG_ENABLED = false; 

/* DOM utilities */
export const DOM = {
  /* Get element by ID */
  getElementById(id) {
    const element = document.getElementById(id);
    if (!element && DEBUG_ENABLED) {
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
    } else if (DEBUG_ENABLED) {
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
    if (DEBUG_ENABLED) {
      console.log(`[DEBUG] ${message}`, data || "");
    }
  },

  /* Log general messages */
  logMessage(message) {
    console.log(`[GAME] ${message}`);
  },

  /* Format number for display (simplified for game constraints) */
  formatNumber(num) {
    return num.toString();
  },
};

/* Initialization */

/* Initialize core functionality */
export function initializeCore() {
  Utils.debug("Core module initialized");

  /* Global error handling */
  window.addEventListener("error", (event) => {
    if (DEBUG_ENABLED) {
      console.error("Global error:", event.error);
    }
  });

  /* Unhandled promise rejection handling */
  window.addEventListener("unhandledrejection", (event) => {
    if (DEBUG_ENABLED) {
      console.error("Unhandled promise rejection:", event.reason);
    }
  });
}

/* Export default object */
export default {
  CONSTANTS,
  DOM,
  Events,
  Utils,
  initializeCore,
};
