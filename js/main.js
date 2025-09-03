/**
 * Main.js - Application entry point
 * This is the main entry point that imports and initializes all modules
 * in a clean, organized, and modular way.
 */

// Import core functionality
import { initializeCore, CONFIG, Utils } from './cores/core.js';

// Import feature modules
import { initializeNavigation } from './navigation/navigation.js';
import { initializeUtils } from './cores/utils.js';
import { initializeLeaderboard } from './games/leaderboard.js';
import { initializeCookieClicker } from './games/clicker.js';
import { initializeNumberGuessingGame } from './games/guessing.js';

/**
 * Application class to manage the entire application lifecycle
 */
class Application {
    constructor() {
        this.modules = {
            navigation: null,
            utils: null,
            leaderboard: null,
            cookieClicker: null,
            numberGuessing: null
        };
        
        this.isInitialized = false;
        
        // Bind methods
        this.initialize = this.initialize.bind(this);
        this.destroy = this.destroy.bind(this);
        
        Utils.debug('Application instance created');
    }
    
    /**
     * Initialize the application and all its modules
     */
    async initialize() {
        try {
            Utils.debug('Initializing application...');
            
            // Initialize core functionality first
            initializeCore();
            
            // Initialize navigation module
            this.modules.navigation = initializeNavigation();
            
            // Initialize utility modules
            this.modules.utils = initializeUtils({
                enableSmoothScroll: true,
                enableFormValidation: true,
                enableStorage: true,
                storagePrefix: 'mainkeun_',
                smoothScrollOptions: {
                    behavior: 'smooth',
                    block: 'start',
                    offset: 80 // Account for sticky header
                }
            });
            
            // Initialize leaderboard system
            this.modules.leaderboard = initializeLeaderboard({
                maxEntries: 10,
                enableDebug: CONFIG.DEBUG
            });
            
            // Initialize games
            this.modules.cookieClicker = initializeCookieClicker({
                enableDebug: CONFIG.DEBUG
            });
            
            this.modules.numberGuessing = initializeNumberGuessingGame({
                enableDebug: CONFIG.DEBUG
            });

            // Make modules globally accessible
            if (typeof window !== 'undefined') {
                window.gameLeaderboard = this.modules.leaderboard;
                window.cookieClickerGame = this.modules.cookieClicker;
                window.numberGuessingGame = this.modules.numberGuessing;
            }
            
            this.isInitialized = true;
            Utils.debug('Application initialized successfully');
            
            // Dispatch custom event for other scripts that might need to know
            this.dispatchInitializedEvent();
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.isInitialized = false;
        }
    }
    
    /**
     * Dispatch application initialized event
     */
    dispatchInitializedEvent() {
        const event = new CustomEvent('applicationInitialized', {
            detail: {
                modules: this.modules,
                timestamp: Date.now()
            }
        });
        
        document.dispatchEvent(event);
        Utils.debug('Application initialized event dispatched');
    }
    
    /**
     * Get a specific module instance
     * @param {string} moduleName - Name of the module
     * @returns {Object|null} - Module instance or null
     */
    getModule(moduleName) {
        return this.modules[moduleName] || null;
    }
    
    /**
     * Check if application is initialized
     * @returns {boolean} - True if initialized
     */
    isReady() {
        return this.isInitialized;
    }
    
    /**
     * Destroy the application and clean up all modules
     */
    destroy() {
        Utils.debug('Destroying application...');
        
        // Destroy navigation module
        if (this.modules.navigation && typeof this.modules.navigation.destroy === 'function') {
            this.modules.navigation.destroy();
        }
        
        // Destroy utility modules
        if (this.modules.utils) {
            if (this.modules.utils.smoothScroll && typeof this.modules.utils.smoothScroll.destroy === 'function') {
                this.modules.utils.smoothScroll.destroy();
            }
        }
        
        // Reset modules
        this.modules = {
            navigation: null,
            utils: null
        };
        
        this.isInitialized = false;
        Utils.debug('Application destroyed');
    }
    
    /**
     * Restart the application
     */
    async restart() {
        this.destroy();
        await this.initialize();
    }
}

// Create global application instance
let app = null;

/**
 * Initialize application when DOM is ready
 */
function initializeApplication() {
    if (app) {
        Utils.debug('Application already exists, skipping initialization');
        return app;
    }
    
    app = new Application();
    app.initialize();
    
    // Make app globally accessible for debugging (only in debug mode)
    if (CONFIG.DEBUG) {
        window.MainkeunApp = app;
    }
    
    return app;
}

/**
 * DOM Content Loaded event handler
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeApplication();
});

// Handle page visibility changes to potentially pause/resume functionality
document.addEventListener('visibilitychange', () => {
    if (app) {
        Utils.debug(`Page visibility changed: ${document.hidden ? 'hidden' : 'visible'}`);
    }
});

// Handle before unload to clean up if needed
window.addEventListener('beforeunload', () => {
    if (app) {
        Utils.debug('Page unloading, cleaning up...');
        // Perform any necessary cleanup here
    }
});

// Export for potential use by other scripts
export { Application, initializeApplication };

// Export app instance getter
export function getApp() {
    return app;
}

// Export default for convenience
export default {
    Application,
    initializeApplication,
    getApp
};
