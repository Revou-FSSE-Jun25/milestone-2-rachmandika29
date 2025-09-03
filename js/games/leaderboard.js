/* Leaderboard System for Games */

/* Import core functionality */
import { DOM, Events, Utils, CONFIG } from '../cores/core.js';
import { StorageManager } from '../cores/utils.js';

/* Leaderboard class */
class Leaderboard {
    constructor(options = {}) {
        this.options = {
            storageKey: 'gameLeaderboards',
            maxEntries: 10,
            enableDebug: CONFIG.DEBUG,
            ...options
        };
        
        /* Initialize storage manager with prefix */
        this.storage = new StorageManager('leaderboard_');
        
        /* Bind methods */
        this.boundMethods = {
            handleScoreSubmission: this.handleScoreSubmission.bind(this)
        };
        
        this.isInitialized = false;
        Utils.debug('Leaderboard instance created');
    }

    /* Initialize leaderboard data and setup */
    initialize() {
        try {
            const data = this.getLeaderboardData();
            if (!data.clicker) {
                data.clicker = [];
            }
            if (!data.numguess) {
                data.numguess = [];
            }
            this.saveLeaderboardData(data);
            
            this.isInitialized = true;
            Utils.debug('Leaderboard initialized successfully');
            return this;
        } catch (error) {
            Utils.debug('Error initializing leaderboard:', error);
            throw error;
        }
    }

    /* Get all leaderboard data from storage */
    getLeaderboardData() {
        try {
            const data = this.storage.getItem(this.options.storageKey, {});
            return typeof data === 'object' ? data : {};
        } catch (error) {
            Utils.debug('Error loading leaderboard data:', error);
            return {};
        }
    }

    /* Save leaderboard data to storage */
    saveLeaderboardData(data) {
        try {
            this.storage.setItem(this.options.storageKey, data);
            Utils.debug('Leaderboard data saved successfully');
        } catch (error) {
            Utils.debug('Error saving leaderboard data:', error);
        }
    }

    /* Add a new score to the leaderboard */
    addScore(gameType, playerName, score, additionalData = {}) {
        if (!this.isInitialized) {
            Utils.debug('Leaderboard not initialized');
            return false;
        }
        
        if (!playerName || playerName.trim() === '') {
            playerName = 'Anonymous';
        }

        const data = this.getLeaderboardData();
        if (!data[gameType]) {
            data[gameType] = [];
        }

        const entry = {
            name: playerName.trim(),
            score: score,
            date: new Date().toISOString(),
            timestamp: Date.now(),
            ...additionalData
        };

        data[gameType].push(entry);
        
        /* Sort by score (descending for most games) */
        if (gameType === 'clicker') {
            data[gameType].sort((a, b) => b.score - a.score);
        } else if (gameType === 'numguess') {
            /* For number guessing, lower attempts = better score */
            data[gameType].sort((a, b) => a.score - b.score);
        }

        /* Keep only top entries */
        data[gameType] = data[gameType].slice(0, this.options.maxEntries);

        this.saveLeaderboardData(data);
        Utils.debug(`Score added for ${gameType}: ${playerName} - ${score}`);
        return this.isNewRecord(gameType, score);
    }

    /* Check if a score qualifies as a new record */
    isNewRecord(gameType, score) {
        const scores = this.getScores(gameType);
        if (scores.length < this.options.maxEntries) {
            return true;
        }
        
        if (gameType === 'clicker') {
            return score > scores[scores.length - 1].score;
        } else if (gameType === 'numguess') {
            return score < scores[scores.length - 1].score;
        }
        return false;
    }

    /* Get scores for a specific game type */
    getScores(gameType) {
        const data = this.getLeaderboardData();
        return data[gameType] || [];
    }

    /* Get top scores for a specific game type */
    getTopScores(gameType, limit = 5) {
        const scores = this.getScores(gameType);
        return scores.slice(0, limit);
    }

    /* Clear leaderboard for a specific game type */
    clearLeaderboard(gameType) {
        const data = this.getLeaderboardData();
        data[gameType] = [];
        this.saveLeaderboardData(data);
        Utils.debug(`Cleared leaderboard for ${gameType}`);
    }

    /* Clear all leaderboards */
    clearAllLeaderboards() {
        this.saveLeaderboardData({});
        Utils.debug('All leaderboards cleared');
    }

    /* Format score display based on game type */
    formatScore(gameType, score) {
        if (gameType === 'clicker') {
            return this.formatNumber(score) + ' cookies';
        } else if (gameType === 'numguess') {
            return score + ' attempt' + (score !== 1 ? 's' : '');
        }
        return score.toString();
    }

    /* Format large numbers with K/M/B/T suffixes */
    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return Math.floor(num).toLocaleString();
    }

    /* Format date for display */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    /* Render leaderboard HTML */
    renderLeaderboard(gameType, containerId, title = 'Leaderboard') {
        const container = DOM.getElementById(containerId);
        if (!container) {
            console.error('Leaderboard container not found:', containerId);
            return;
        }

        const scores = this.getTopScores(gameType, 10);
        
        let html = `
            <div class="terminal-section">
                <h3 class="terminal-text terminal-green-bright mb-4">${title}</h3>
                <div class="terminal-border p-4">
        `;

        if (scores.length === 0) {
            html += `
                <p class="terminal-text text-center">No scores yet. Be the first!</p>
            `;
        } else {
            html += `
                <div class="space-y-2">
            `;
            
            scores.forEach((entry, index) => {
                const rank = index + 1;
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
                
                html += `
                    <div class="flex justify-between items-center terminal-text ${
                        rank <= 3 ? 'terminal-green-bright' : ''
                    }">
                        <span class="flex items-center">
                            <span class="w-8">${medal}</span>
                            <span class="ml-2">${entry.name}</span>
                        </span>
                        <span class="text-right">
                            <div>${this.formatScore(gameType, entry.score)}</div>
                            <div class="text-xs opacity-75">${this.formatDate(entry.date)}</div>
                        </span>
                    </div>
                `;
            });
            
            html += `
                </div>
            `;
        }

        html += `
                </div>
                <div class="mt-4 text-center">
                    <button id="clear-leaderboard-${gameType}" class="terminal-btn terminal-btn-secondary">
                        Clear Leaderboard
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;

        /* Add clear button event listener */
        const clearBtn = document.getElementById(`clear-leaderboard-${gameType}`);
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear the leaderboard? This action cannot be undone!')) {
                    this.clearLeaderboard(gameType);
                    this.renderLeaderboard(gameType, containerId, title);
                }
            });
        }
    }

    /* Show score submission modal */
    showScoreSubmission(gameType, score, callback) {
        const isRecord = this.isNewRecord(gameType, score);
        const modalHtml = `
            <div id="score-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="terminal-border bg-black p-6 max-w-md w-full mx-4">
                    <h3 class="terminal-text terminal-green-bright text-xl mb-4 text-center">
                        ${isRecord ? '🎉 New Record!' : 'Game Over'}
                    </h3>
                    <p class="terminal-text text-center mb-4">
                        Your Score: <span class="terminal-green-bright">${this.formatScore(gameType, score)}</span>
                    </p>
                    <div class="mb-4">
                        <label class="terminal-text block mb-2">Enter your name:</label>
                        <input type="text" id="player-name" class="terminal-input w-full" 
                               placeholder="Anonymous" maxlength="20">
                    </div>
                    <div class="flex gap-2">
                        <button id="submit-score" class="terminal-btn terminal-btn-primary flex-1">
                            Submit Score
                        </button>
                        <button id="skip-score" class="terminal-btn terminal-btn-secondary flex-1">
                            Skip
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = DOM.getElementById('score-modal');
        const nameInput = DOM.getElementById('player-name');
        const submitBtn = DOM.getElementById('submit-score');
        const skipBtn = DOM.getElementById('skip-score');

        nameInput.focus();

        const closeModal = () => {
            modal.remove();
            if (callback) callback();
        };

        Events.addEventListener(submitBtn, 'click', () => {
            const playerName = nameInput.value.trim() || 'Anonymous';
            this.addScore(gameType, playerName, score);
            closeModal();
        });

        Events.addEventListener(skipBtn, 'click', closeModal);

        /* Submit on Enter key */
        Events.addEventListener(nameInput, 'keypress', (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });

        /* Close on Escape key */
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                Events.removeEventListener(document, 'keydown', escapeHandler);
                closeModal();
            }
        };
        Events.addEventListener(document, 'keydown', escapeHandler);
    }
    /* Handle score submission event */
    handleScoreSubmission(event) {
        const { gameType, score, callback } = event.detail;
        this.showScoreSubmission(gameType, score, callback);
    }
    
    /* Destroy leaderboard instance */
    destroy() {
        this.isInitialized = false;
        Utils.debug('Leaderboard destroyed');
    }
}

/* Initialize leaderboard system */
export function initializeLeaderboard(options = {}) {
    try {
        const leaderboard = new Leaderboard(options);
        leaderboard.initialize();
        
        Utils.debug('Leaderboard system initialized');
        return leaderboard;
    } catch (error) {
        Utils.debug('Error initializing leaderboard system:', error);
        throw error;
    }
}

/* Export classes and functions */
export { Leaderboard };

/* Default export */
export default {
    Leaderboard,
    initializeLeaderboard
};

/* Create global instance for backward compatibility */
if (typeof window !== 'undefined') {
    window.gameLeaderboard = null;
}