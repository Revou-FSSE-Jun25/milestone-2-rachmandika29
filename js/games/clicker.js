// Cookie Clicker Game - Main Logic
// Modular implementation with state management, upgrades, and achievements

import { Utils } from '../cores/core.js';
import { initializeNavigation } from '../navigation/navigation.js';

class CookieClickerGame {
    constructor() {
        this.gameState = {
            cookies: 0,
            totalClicks: 0,
            clickPower: 1,
            cookiesPerSecond: 0,
            upgrades: {},
            achievements: [],
            startTime: Date.now()
        };

        this.upgrades = {
            cursor: {
                name: 'Cursor',
                description: 'Automatically clicks the cookie',
                baseCost: 15,
                baseProduction: 0.1,
                owned: 0,
                icon: '👆'
            },
            grandma: {
                name: 'Grandma',
                description: 'A nice grandma to bake more cookies',
                baseCost: 100,
                baseProduction: 1,
                owned: 0,
                icon: '👵'
            },
            farm: {
                name: 'Cookie Farm',
                description: 'Grows cookie plants',
                baseCost: 1100,
                baseProduction: 8,
                owned: 0,
                icon: '🚜'
            },
            mine: {
                name: 'Cookie Mine',
                description: 'Mines cookie dough from the earth',
                baseCost: 12000,
                baseProduction: 47,
                owned: 0,
                icon: '⛏️'
            },
            factory: {
                name: 'Cookie Factory',
                description: 'Mass produces cookies',
                baseCost: 130000,
                baseProduction: 260,
                owned: 0,
                icon: '🏭'
            },
            bank: {
                name: 'Cookie Bank',
                description: 'Generates cookies from interest',
                baseCost: 1400000,
                baseProduction: 1400,
                owned: 0,
                icon: '🏦'
            },
            temple: {
                name: 'Cookie Temple',
                description: 'Summons cookies from the beyond',
                baseCost: 20000000,
                baseProduction: 7800,
                owned: 0,
                icon: '🏛️'
            },
            wizard: {
                name: 'Wizard Tower',
                description: 'Casts spells to create cookies',
                baseCost: 330000000,
                baseProduction: 44000,
                owned: 0,
                icon: '🧙'
            }
        };

        this.achievements = [
            { id: 'first_click', name: 'First Click', description: 'Click the cookie for the first time', requirement: () => this.gameState.totalClicks >= 1, unlocked: false },
            { id: 'hundred_cookies', name: 'Cookie Collector', description: 'Bake 100 cookies', requirement: () => this.gameState.cookies >= 100, unlocked: false },
            { id: 'thousand_cookies', name: 'Cookie Hoarder', description: 'Bake 1,000 cookies', requirement: () => this.gameState.cookies >= 1000, unlocked: false },
            { id: 'hundred_clicks', name: 'Clicking Frenzy', description: 'Click 100 times', requirement: () => this.gameState.totalClicks >= 100, unlocked: false },
            { id: 'first_upgrade', name: 'First Purchase', description: 'Buy your first upgrade', requirement: () => Object.values(this.gameState.upgrades).some(count => count > 0), unlocked: false },
            { id: 'ten_cursors', name: 'Cursor Master', description: 'Own 10 cursors', requirement: () => this.gameState.upgrades.cursor >= 10, unlocked: false },
            { id: 'million_cookies', name: 'Cookie Millionaire', description: 'Bake 1,000,000 cookies', requirement: () => this.gameState.cookies >= 1000000, unlocked: false },
            { id: 'one_hour', name: 'Dedicated Baker', description: 'Play for 1 hour', requirement: () => (Date.now() - this.gameState.startTime) >= 3600000, unlocked: false },
            { id: 'hundred_per_second', name: 'Production Line', description: 'Reach 100 cookies per second', requirement: () => this.gameState.cookiesPerSecond >= 100, unlocked: false },
            { id: 'all_upgrades', name: 'Diversified Portfolio', description: 'Own at least one of every upgrade', requirement: () => Object.keys(this.upgrades).every(key => this.gameState.upgrades[key] > 0), unlocked: false }
        ];

        this.elements = {};
        this.gameLoop = null;
        this.autoSaveInterval = null;
    }

    // Initialize the game
    async init() {
        try {
            Utils.logMessage('Initializing Cookie Clicker Game...');
            
            // Initialize navigation
            await initializeNavigation();
            
            // Cache DOM elements
            this.cacheElements();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize upgrades object
            Object.keys(this.upgrades).forEach(key => {
                this.gameState.upgrades[key] = 0;
            });
            
            // Start game loop
            this.startGameLoop();
            
            // Initial UI update
            this.updateUI();
            this.renderUpgrades();
            this.renderAchievements();
            this.renderLeaderboard();
            
            Utils.logMessage('Cookie Clicker Game initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize Cookie Clicker Game:', error);
        }
    }

    // Cache DOM elements for performance
    cacheElements() {
        this.elements = {
            mainClicker: document.getElementById('mainClicker'),
            totalScore: document.getElementById('totalScore'),
            cookiesPerSecond: document.getElementById('cookiesPerSecond'),
            totalClicks: document.getElementById('totalClicks'),
            clickPower: document.getElementById('clickPower'),
            upgradesList: document.getElementById('upgradesList'),
            achievementsList: document.getElementById('achievementsList'),
            clickEffects: document.getElementById('clickEffects'),
            achievementNotification: document.getElementById('achievementNotification'),
            achievementText: document.getElementById('achievementText')
        };
    }

    // Set up event listeners
    setupEventListeners() {
        // Main clicker
        this.elements.mainClicker.addEventListener('click', (e) => this.handleClick(e));
        this.elements.mainClicker.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleClick(e);
            }
        });


    }

    // Handle cookie clicks
    handleClick(event) {
        const clickValue = this.gameState.clickPower;
        this.gameState.cookies += clickValue;
        this.gameState.totalClicks++;
        
        // Create click effect
        this.createClickEffect(event, clickValue);
        
        // Add click animation
        this.elements.mainClicker.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.elements.mainClicker.style.transform = 'scale(1)';
        }, 100);
        
        // Update UI
        this.updateUI();
        this.checkAchievements();
        
        Utils.logMessage(`Clicked! Got ${clickValue} cookies. Total: ${this.gameState.cookies}`);
    }

    // Create visual click effect
    createClickEffect(event, value) {
        const effect = document.createElement('div');
        effect.className = 'click-effect absolute text-2xl font-bold text-yellow-400 pointer-events-none animate-bounce';
        effect.textContent = `+${Utils.formatNumber(value)}`;
        effect.style.left = '50%';
        effect.style.top = '50%';
        effect.style.transform = 'translate(-50%, -50%)';
        effect.style.zIndex = '10';
        
        this.elements.clickEffects.appendChild(effect);
        
        // Animate and remove
        setTimeout(() => {
            effect.style.opacity = '0';
            effect.style.transform = 'translate(-50%, -100px)';
            effect.style.transition = 'all 1s ease-out';
        }, 100);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1100);
    }

    // Buy upgrade
    buyUpgrade(upgradeKey) {
        const upgrade = this.upgrades[upgradeKey];
        const currentOwned = this.gameState.upgrades[upgradeKey] || 0;
        const cost = this.calculateUpgradeCost(upgrade, currentOwned);
        
        if (this.gameState.cookies >= cost) {
            this.gameState.cookies -= cost;
            this.gameState.upgrades[upgradeKey] = currentOwned + 1;
            
            // Update cookies per second
            this.calculateCookiesPerSecond();
            
            // Update UI
            this.updateUI();
            this.renderUpgrades();
            this.checkAchievements();
            
            Utils.logMessage(`Bought ${upgrade.name}! Now owned: ${this.gameState.upgrades[upgradeKey]}`);
        }
    }

    // Calculate upgrade cost with scaling
    calculateUpgradeCost(upgrade, owned) {
        return Math.floor(upgrade.baseCost * Math.pow(1.15, owned));
    }

    // Calculate total cookies per second
    calculateCookiesPerSecond() {
        let total = 0;
        for (const [key, upgrade] of Object.entries(this.upgrades)) {
            const owned = this.gameState.upgrades[key] || 0;
            total += upgrade.baseProduction * owned;
        }
        this.gameState.cookiesPerSecond = total;
    }

    // Render upgrades in the shop
    renderUpgrades() {
        this.elements.upgradesList.innerHTML = '';
        
        for (const [key, upgrade] of Object.entries(this.upgrades)) {
            const owned = this.gameState.upgrades[key] || 0;
            const cost = this.calculateUpgradeCost(upgrade, owned);
            const canAfford = this.gameState.cookies >= cost;
            
            const upgradeElement = document.createElement('div');
            upgradeElement.className = `upgrade-item p-4 bg-gray-700 rounded-lg cursor-pointer transition-all duration-200 ${canAfford ? 'hover:bg-gray-600 border-l-4 border-green-500' : 'opacity-50 border-l-4 border-red-500'}`;
            upgradeElement.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <span class="text-2xl">${upgrade.icon}</span>
                        <div>
                            <h3 class="font-semibold text-white">${upgrade.name}</h3>
                            <p class="text-sm text-gray-300">${upgrade.description}</p>
                            <p class="text-xs text-blue-400">+${Utils.formatNumber(upgrade.baseProduction)} cookies/sec</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-lg font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}">
                            ${Utils.formatNumber(cost)}
                        </div>
                        <div class="text-sm text-gray-400">Owned: ${owned}</div>
                    </div>
                </div>
            `;
            
            if (canAfford) {
                upgradeElement.addEventListener('click', () => this.buyUpgrade(key));
                upgradeElement.setAttribute('tabindex', '0');
                upgradeElement.setAttribute('role', 'button');
                upgradeElement.setAttribute('aria-label', `Buy ${upgrade.name} for ${Utils.formatNumber(cost)} cookies`);
                
                upgradeElement.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.buyUpgrade(key);
                    }
                });
            }
            
            this.elements.upgradesList.appendChild(upgradeElement);
        }
    }

    // Check and unlock achievements
    checkAchievements() {
        for (const achievement of this.achievements) {
            if (!achievement.unlocked && achievement.requirement()) {
                achievement.unlocked = true;
                this.gameState.achievements.push(achievement.id);
                this.showAchievementNotification(achievement);
                this.renderAchievements();
            }
        }
    }

    // Show achievement notification
    showAchievementNotification(achievement) {
        this.elements.achievementText.textContent = achievement.name;
        this.elements.achievementNotification.style.transform = 'translateX(0)';
        
        setTimeout(() => {
            this.elements.achievementNotification.style.transform = 'translateX(100%)';
        }, 3000);
        
        Utils.logMessage(`Achievement unlocked: ${achievement.name}`);
    }

    // Render achievements list
    renderAchievements() {
        this.elements.achievementsList.innerHTML = '';
        
        for (const achievement of this.achievements) {
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item p-3 rounded-lg ${achievement.unlocked ? 'bg-green-800 border-l-4 border-green-400' : 'bg-gray-700 border-l-4 border-gray-500'}`;
            achievementElement.innerHTML = `
                <div class="flex items-center space-x-3">
                    <span class="text-xl">${achievement.unlocked ? '🏆' : '🔒'}</span>
                    <div>
                        <h4 class="font-semibold ${achievement.unlocked ? 'text-green-300' : 'text-gray-400'}">${achievement.name}</h4>
                        <p class="text-sm ${achievement.unlocked ? 'text-green-200' : 'text-gray-500'}">${achievement.description}</p>
                    </div>
                </div>
            `;
            
            this.elements.achievementsList.appendChild(achievementElement);
        }
    }

    // Update UI elements
    updateUI() {
        this.elements.totalScore.textContent = Utils.formatNumber(this.gameState.cookies);
        this.elements.cookiesPerSecond.textContent = Utils.formatNumber(this.gameState.cookiesPerSecond);
        this.elements.totalClicks.textContent = Utils.formatNumber(this.gameState.totalClicks);
        this.elements.clickPower.textContent = Utils.formatNumber(this.gameState.clickPower);
    }

    // Game loop for passive income
    startGameLoop() {
        this.gameLoop = setInterval(() => {
            if (this.gameState.cookiesPerSecond > 0) {
                this.gameState.cookies += this.gameState.cookiesPerSecond / 10; // Update 10 times per second
                this.updateUI();
                this.checkAchievements();
                this.checkLeaderboardTriggers();
            }
        }, 100);
    }

    // Auto-save functionality
    // Render leaderboard
    renderLeaderboard() {
        if (typeof gameLeaderboard !== 'undefined' && gameLeaderboard && gameLeaderboard.isInitialized) {
            gameLeaderboard.renderLeaderboard('clicker', 'clicker-leaderboard', 'Cookie Clicker Leaderboard');
        } else {
            // Retry after a short delay if leaderboard isn't ready
            setTimeout(() => this.renderLeaderboard(), 100);
        }
    }

    // Submit score to leaderboard
    submitToLeaderboard() {
        if (typeof gameLeaderboard !== 'undefined' && gameLeaderboard && gameLeaderboard.isInitialized && this.gameState.cookies >= 1000) {
            gameLeaderboard.showScoreSubmission('clicker', Math.floor(this.gameState.cookies), () => {
                this.renderLeaderboard();
            });
        }
    }

    // Check for leaderboard submission triggers
    checkLeaderboardTriggers() {
        // Submit to leaderboard when reaching certain milestones
        const milestones = [1000, 10000, 100000, 1000000, 10000000];
        const currentCookies = Math.floor(this.gameState.cookies);
        
        for (const milestone of milestones) {
            if (currentCookies >= milestone && !this.gameState.leaderboardSubmissions?.includes(milestone)) {
                if (!this.gameState.leaderboardSubmissions) {
                    this.gameState.leaderboardSubmissions = [];
                }
                this.gameState.leaderboardSubmissions.push(milestone);
                
                // Show submission modal for significant milestones
                if (milestone >= 10000) {
                    setTimeout(() => {
                        this.submitToLeaderboard();
                    }, 1000);
                }
                break;
            }
        }
    }

    // Cleanup when leaving the page
    destroy() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
    }
}

// Game instance holder
let gameInstance = null;

/**
 * Initialize the Cookie Clicker Game
 * @param {Object} options - Configuration options
 * @returns {Object} Game instance and control methods
 */
function initializeCookieClicker(options = {}) {
    const config = {
        enableDebug: false,
        autoStart: true,
        ...options
    };

    // Only initialize if we're on the clicker page
    const mainClicker = document.getElementById('mainClicker');
    if (!mainClicker) {
        return null;
    }

    try {
        gameInstance = new CookieClickerGame();
        
        // Initialize the game
        gameInstance.init().then(() => {
            if (config.enableDebug) {
                console.log('Cookie Clicker Game initialized successfully');
            }
        }).catch(error => {
            console.error('Failed to initialize Cookie Clicker Game:', error);
        });

        // Setup cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (gameInstance) {
                gameInstance.destroy();
            }
        });

        return {
            instance: gameInstance,
            isInitialized: true,
            destroy: () => {
                if (gameInstance) {
                    gameInstance.destroy();
                    gameInstance = null;
                }
            }
        };
    } catch (error) {
        console.error('Error initializing Cookie Clicker Game:', error);
        return null;
    }
}

export { CookieClickerGame, initializeCookieClicker };