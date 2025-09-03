/* Constants */
export const CONSTANTS = {
    /* Breakpoints */
    MOBILE_BREAKPOINT: 768,
    /* Animation durations */
    ANIMATION_DURATION: 300,
    
    /* Game settings */
    GAME_SETTINGS: {
        NUMBER_GUESSING: {
            MIN_NUMBER: 1,
            MAX_NUMBER: 100,
            MAX_ATTEMPTS: 10
        }
    },
    
    /* UI Messages */
    MESSAGES: {
        SYSTEM_INITIALIZED: 'SYSTEM INITIALIZED. RANDOM NUMBER GENERATED.',
        GAME_OVER: 'GAME OVER',
        SUCCESS: 'SUCCESS'
    },
    
    /* CSS Classes */
    CSS_CLASSES: {
        HIDDEN: 'hidden',
        FADE_IN: 'animate-fade-in',
        TERMINAL_GLOW: 'terminal-glow'
    },
    
    /* Aria attributes */
    ARIA: {
        EXPANDED: 'aria-expanded'
    }
};

/* Configuration */
export const CONFIG = {
    
    /* Animation settings */
    animations: {
        enabled: true,
        duration: CONSTANTS.ANIMATION_DURATION
    },
    
    /* Accessibility settings */
    accessibility: {
        enableKeyboardNavigation: true,
        enableScreenReaderSupport: true
    }
};

/* Utility functions */

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
    
    /* Get elements by selector */
    querySelectorAll(selector, parent = document) {
        return parent.querySelectorAll(selector);
    },
    
    /* Get single element by selector */
    querySelector(selector, parent = document) {
        return parent.querySelector(selector);
    },
    
    /* Add class to element */
    addClass(element, className) {
        if (element && className) {
            element.classList.add(className);
        }
    },
    
    /* Remove class from element */
    removeClass(element, className) {
        if (element && className) {
            element.classList.remove(className);
        }
    },
    
    /* Toggle class on element */
    toggleClass(element, className) {
        if (element && className) {
            element.classList.toggle(className);
        }
    }
};

/* Event utilities */
export const Events = {
    /* Add event listener */
    addEventListener(element, event, handler, options = {}) {
        if (element && typeof handler === 'function') {
            element.addEventListener(event, handler, options);
        } else if (CONFIG.DEBUG) {
            console.warn('Invalid element or handler for event listener');
        }
    },
    
    /* Remove event listener */
    removeEventListener(element, event, handler) {
        if (element && typeof handler === 'function') {
            element.removeEventListener(event, handler);
        }
    }
};

/* Utility helpers */
export const Utils = {
    /* Generate random number */
    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
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
    
    /* Check if mobile device */
    isMobile() {
        return window.innerWidth < CONSTANTS.MOBILE_BREAKPOINT;
    },
    
    /* Debug logging */
    debug(message, data = null) {
        if (CONFIG.DEBUG) {
            console.log(`[DEBUG] ${message}`, data || '');
        }
    },
    
    /* Log general messages */
    logMessage(message) {
        console.log(`[GAME] ${message}`);
    },
    
    /* Format number with appropriate suffixes (K, M, B, etc.) */
    formatNumber(num) {
        if (num < 1000) return num.toString();
        if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
        if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
        if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
        return (num / 1000000000000).toFixed(1) + 'T';
    }
};

/* Animation utilities */
export const Animation = {
    /* Smooth scroll to element */
    scrollToElement(element, options = {}) {
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                ...options
            });
        }
    },
    
    /* Fade in element */
    fadeIn(element) {
        if (element) {
            DOM.removeClass(element, CONSTANTS.CSS_CLASSES.HIDDEN);
            DOM.addClass(element, CONSTANTS.CSS_CLASSES.FADE_IN);
        }
    },
    
    /* Fade out element */
    fadeOut(element) {
        if (element) {
            DOM.addClass(element, CONSTANTS.CSS_CLASSES.HIDDEN);
            DOM.removeClass(element, CONSTANTS.CSS_CLASSES.FADE_IN);
        }
    }
};

/* Initialization */

/* Initialize core functionality */
export function initializeCore() {
    Utils.debug('Core module initialized');
    
    /* Global error handling */
    window.addEventListener('error', (event) => {
        if (CONFIG.DEBUG) {
            console.error('Global error:', event.error);
        }
    });
    
    /* Unhandled promise rejection handling */
    window.addEventListener('unhandledrejection', (event) => {
        if (CONFIG.DEBUG) {
            console.error('Unhandled promise rejection:', event.reason);
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
    Animation,
    initializeCore
};