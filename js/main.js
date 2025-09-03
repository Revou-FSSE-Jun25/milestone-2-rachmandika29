/* Application entry point */

/* Core imports */
import { initializeCore, CONFIG, Utils } from './cores/core.js';

/* Feature imports */
import { initializeNavigation } from './navigation/navigation.js';
import { initializeUtils } from './cores/utils.js';
import { initializeLeaderboard } from './games/leaderboard.js';
import { initializeCookieClicker } from './games/clicker.js';
import { initializeNumberGuessingGame } from './games/guessing.js';

/* Application class */
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
        
        /* Bind methods */
        this.initialize = this.initialize.bind(this);
        this.destroy = this.destroy.bind(this);
        
        Utils.debug('Application instance created');
    }
    
    /* Initialize application */
    async initialize() {
        try {
            Utils.debug('Initializing application...');
            
            /* Initialize core */
            initializeCore();
            
            /* Initialize navigation */
            this.modules.navigation = initializeNavigation();
            
            /* Initialize utilities */
            this.modules.utils = initializeUtils({
                enableSmoothScroll: true,
                enableFormValidation: true,
                enableStorage: true,
                storagePrefix: 'mainkeun_',
                smoothScrollOptions: {
                    behavior: 'smooth',
                    block: 'start',
                    offset: 80 /* Header offset */
                }
            });
            
            /* Initialize leaderboard */
            this.modules.leaderboard = initializeLeaderboard({
                maxEntries: 10,
                enableDebug: CONFIG.DEBUG
            });
            
            /* Initialize games */
            this.modules.cookieClicker = initializeCookieClicker({
                enableDebug: CONFIG.DEBUG
            });
            
            this.modules.numberGuessing = initializeNumberGuessingGame({
                enableDebug: CONFIG.DEBUG
            });

            /* Global module access */
            if (typeof window !== 'undefined') {
                window.gameLeaderboard = this.modules.leaderboard;
                window.cookieClickerGame = this.modules.cookieClicker;
                window.numberGuessingGame = this.modules.numberGuessing;
            }
            
            this.isInitialized = true;
            Utils.debug('Application initialized successfully');
            
            /* Dispatch initialized event */
            this.dispatchInitializedEvent();
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.isInitialized = false;
        }
    }
    
    /* Dispatch initialized event */
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
    
    /* Get module instance */
    getModule(moduleName) {
        return this.modules[moduleName] || null;
    }
    
    /* Check if initialized */
    isReady() {
        return this.isInitialized;
    }
    
    /* Destroy application */
    destroy() {
        Utils.debug('Destroying application...');
        
        /* Destroy navigation */
        if (this.modules.navigation && typeof this.modules.navigation.destroy === 'function') {
            this.modules.navigation.destroy();
        }
        
        /* Destroy utilities */
        if (this.modules.utils) {
            if (this.modules.utils.smoothScroll && typeof this.modules.utils.smoothScroll.destroy === 'function') {
                this.modules.utils.smoothScroll.destroy();
            }
        }
        
        /* Reset modules */
        this.modules = {
            navigation: null,
            utils: null
        };
        
        this.isInitialized = false;
        Utils.debug('Application destroyed');
    }
    
    /* Restart application */
    async restart() {
        this.destroy();
        await this.initialize();
    }
}

/* Global application instance */
let app = null;

/* Initialize when DOM ready */
function initializeApplication() {
    if (app) {
        Utils.debug('Application already exists, skipping initialization');
        return app;
    }
    
    app = new Application();
    app.initialize();
    
    /* Global debug access */
    if (CONFIG.DEBUG) {
        window.MainkeunApp = app;
    }
    
    return app;
}

/* DOM ready handler */
document.addEventListener('DOMContentLoaded', () => {
    initializeApplication();
});

/* Page visibility handler */
document.addEventListener('visibilitychange', () => {
    if (app) {
        Utils.debug(`Page visibility changed: ${document.hidden ? 'hidden' : 'visible'}`);
    }
});

/* Page unload handler */
window.addEventListener('beforeunload', () => {
    if (app) {
        Utils.debug('Page unloading, cleaning up...');
        /* Cleanup on unload */
    }
});

/* Module exports */
export { Application, initializeApplication };

/* App getter export */
export function getApp() {
    return app;
}

/* Default export */
export default {
    Application,
    initializeApplication,
    getApp
};
