// ===== CONSTANTS =====
export const CONSTANTS = {
    // Breakpoints
    MOBILE_BREAKPOINT: 768,
    // Animation durations
    ANIMATION_DURATION: 300,
    
    // Game settings
    GAME_SETTINGS: {
        NUMBER_GUESSING: {
            MIN_NUMBER: 1,
            MAX_NUMBER: 100,
            MAX_ATTEMPTS: 10
        }
    },
    
    // UI Messages
    MESSAGES: {
        SYSTEM_INITIALIZED: 'SYSTEM INITIALIZED. RANDOM NUMBER GENERATED.',
        GAME_OVER: 'GAME OVER',
        SUCCESS: 'SUCCESS'
    },
    
    // CSS Classes
    CSS_CLASSES: {
        HIDDEN: 'hidden',
        FADE_IN: 'animate-fade-in',
        TERMINAL_GLOW: 'terminal-glow'
    },
    
    // Aria attributes
    ARIA: {
        EXPANDED: 'aria-expanded'
    }
};

// ===== CONFIGURATION =====
export const CONFIG = {
    // Debug mode
    DEBUG: false,
    
    // Animation settings
    animations: {
        enabled: true,
        duration: CONSTANTS.ANIMATION_DURATION
    },
    
    // Accessibility settings
    accessibility: {
        enableKeyboardNavigation: true,
        enableScreenReaderSupport: true
    }
};

// ===== UTILITY FUNCTIONS =====

/**
 * DOM utility functions
 */
export const DOM = {
    /**
     * Get element by ID with error handling
     * @param {string} id - Element ID
     * @returns {HTMLElement|null} - Element or null if not found
     */
    getElementById(id) {
        const element = document.getElementById(id);
        if (!element && CONFIG.DEBUG) {
            console.warn(`Element with ID '${id}' not found`);
        }
        return element;
    },
    
    /**
     * Get elements by selector with error handling
     * @param {string} selector - CSS selector
     * @param {HTMLElement} parent - Parent element (optional)
     * @returns {NodeList} - NodeList of elements
     */
    querySelectorAll(selector, parent = document) {
        return parent.querySelectorAll(selector);
    },
    
    /**
     * Get single element by selector
     * @param {string} selector - CSS selector
     * @param {HTMLElement} parent - Parent element (optional)
     * @returns {HTMLElement|null} - Element or null if not found
     */
    querySelector(selector, parent = document) {
        return parent.querySelector(selector);
    },
    
    /**
     * Add class to element
     * @param {HTMLElement} element - Target element
     * @param {string} className - Class name to add
     */
    addClass(element, className) {
        if (element && className) {
            element.classList.add(className);
        }
    },
    
    /**
     * Remove class from element
     * @param {HTMLElement} element - Target element
     * @param {string} className - Class name to remove
     */
    removeClass(element, className) {
        if (element && className) {
            element.classList.remove(className);
        }
    },
    
    /**
     * Toggle class on element
     * @param {HTMLElement} element - Target element
     * @param {string} className - Class name to toggle
     */
    toggleClass(element, className) {
        if (element && className) {
            element.classList.toggle(className);
        }
    }
};

/**
 * Event utility functions
 */
export const Events = {
    /**
     * Add event listener with error handling
     * @param {HTMLElement} element - Target element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     */
    addEventListener(element, event, handler, options = {}) {
        if (element && typeof handler === 'function') {
            element.addEventListener(event, handler, options);
        } else if (CONFIG.DEBUG) {
            console.warn('Invalid element or handler for event listener');
        }
    },
    
    /**
     * Remove event listener
     * @param {HTMLElement} element - Target element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     */
    removeEventListener(element, event, handler) {
        if (element && typeof handler === 'function') {
            element.removeEventListener(event, handler);
        }
    }
};

/**
 * Utility helper functions
 */
export const Utils = {
    /**
     * Generate random number between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} - Random number
     */
    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Debounce function execution
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} - Debounced function
     */
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
    
    /**
     * Check if device is mobile based on window width
     * @returns {boolean} - True if mobile
     */
    isMobile() {
        return window.innerWidth < CONSTANTS.MOBILE_BREAKPOINT;
    },
    
    /**
     * Log debug messages if debug mode is enabled
     * @param {string} message - Debug message
     * @param {any} data - Additional data to log
     */
    debug(message, data = null) {
        if (CONFIG.DEBUG) {
            console.log(`[DEBUG] ${message}`, data || '');
        }
    }
};

/**
 * Animation utilities
 */
export const Animation = {
    /**
     * Smooth scroll to element
     * @param {HTMLElement} element - Target element
     * @param {Object} options - Scroll options
     */
    scrollToElement(element, options = {}) {
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                ...options
            });
        }
    },
    
    /**
     * Fade in element
     * @param {HTMLElement} element - Target element
     */
    fadeIn(element) {
        if (element) {
            DOM.removeClass(element, CONSTANTS.CSS_CLASSES.HIDDEN);
            DOM.addClass(element, CONSTANTS.CSS_CLASSES.FADE_IN);
        }
    },
    
    /**
     * Fade out element
     * @param {HTMLElement} element - Target element
     */
    fadeOut(element) {
        if (element) {
            DOM.addClass(element, CONSTANTS.CSS_CLASSES.HIDDEN);
            DOM.removeClass(element, CONSTANTS.CSS_CLASSES.FADE_IN);
        }
    }
};

// ===== INITIALIZATION =====

/**
 * Initialize core functionality
 */
export function initializeCore() {
    Utils.debug('Core module initialized');
    
    // Set up global error handling
    window.addEventListener('error', (event) => {
        if (CONFIG.DEBUG) {
            console.error('Global error:', event.error);
        }
    });
    
    // Set up unhandled promise rejection handling
    window.addEventListener('unhandledrejection', (event) => {
        if (CONFIG.DEBUG) {
            console.error('Unhandled promise rejection:', event.reason);
        }
    });
}

// Export default object for convenience
export default {
    CONSTANTS,
    CONFIG,
    DOM,
    Events,
    Utils,
    Animation,
    initializeCore
};