/* Number Guessing Game */

/* Import core functionality */
import { DOM, Utils } from '../cores/core.js';

class NumberGuessingGame {
    constructor() {
        this.targetNumber = 0;
        this.attempts = 10;
        this.maxAttempts = 10;
        this.guesses = [];
        this.gameActive = false;
        
        this.initializeElements();
        this.initializeGame();
        this.bindEvents();
        this.renderLeaderboard();
    }

    initializeElements() {
        this.guessInput = DOM.getElementById('guessInput');
        this.submitBtn = DOM.getElementById('submitBtn');
        this.feedback = DOM.getElementById('feedback');
        this.attemptsLeft = DOM.getElementById('attemptsLeft');
        this.gameStatus = DOM.getElementById('gameStatus');
        this.totalGuesses = DOM.getElementById('totalGuesses');
        this.accuracy = DOM.getElementById('accuracy');
        this.previousGuesses = DOM.getElementById('previousGuesses');
        this.guessList = DOM.getElementById('guessList');
        this.gameContainer = DOM.getElementById('gameContainer');
        this.gameOverContainer = DOM.getElementById('gameOverContainer');
        this.gameOverMessage = DOM.getElementById('gameOverMessage');
        this.resetBtn = DOM.getElementById('resetBtn');
    }

    initializeGame() {
        this.targetNumber = Math.floor(Math.random() * 100) + 1;
        this.attempts = this.maxAttempts;
        this.guesses = [];
        this.gameActive = true;
        
        this.updateDisplay();
        this.hideGameOver();
        this.hideFeedback();
        this.hidePreviousGuesses();
        
        /* Terminal boot sequence */
        this.showTerminalMessage('SYSTEM INITIALIZED. RANDOM NUMBER GENERATED.', 'success');
        
        Utils.debug('Target number is', this.targetNumber);
    }

    bindEvents() {
        this.submitBtn.addEventListener('click', () => this.makeGuess());
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.makeGuess();
            }
        });
        this.resetBtn.addEventListener('click', () => this.initializeGame());
        
        /* Focus input on load */
        this.guessInput.focus();
    }

    makeGuess() {
        if (!this.gameActive) return;
        
        const guess = parseInt(this.guessInput.value);
        
        if (!this.validateGuess(guess)) {
            return;
        }
        
        this.guesses.push(guess);
        this.attempts--;
        
        const result = this.evaluateGuess(guess);
        this.showFeedback(result, guess);
        this.updateDisplay();
        this.updatePreviousGuesses();
        
        if (result === 'correct') {
            this.endGame(true);
        } else if (this.attempts === 0) {
            this.endGame(false);
        }
        
        this.guessInput.value = '';
        this.guessInput.focus();
    }

    validateGuess(guess) {
        if (isNaN(guess) || guess < 1 || guess > 100) {
            this.showTerminalMessage('ERROR: INVALID INPUT. RANGE: 1-100', 'error');
            return false;
        }
        
        if (this.guesses.includes(guess)) {
            this.showTerminalMessage('WARNING: NUMBER ALREADY PROCESSED', 'warning');
            return false;
        }
        
        return true;
    }

    evaluateGuess(guess) {
        if (guess === this.targetNumber) {
            return 'correct';
        } else if (guess < this.targetNumber) {
            return 'low';
        } else {
            return 'high';
        }
    }

    showFeedback(result, guess) {
        let message = '';
        let className = '';
        
        switch (result) {
            case 'correct':
                message = `PROTOCOL SUCCESS: ${guess} IS THE TARGET NUMBER!`;
                className = 'border-terminal-green text-terminal-green-bright';
                break;
            case 'low':
                message = `ANALYSIS: ${guess} < TARGET_NUMBER. INCREASE VALUE.`;
                className = 'border-yellow-500 text-yellow-400';
                break;
            case 'high':
                message = `ANALYSIS: ${guess} > TARGET_NUMBER. DECREASE VALUE.`;
                className = 'border-red-500 text-red-400';
                break;
        }
        
        this.feedback.textContent = message;
        this.feedback.className = `p-4 border bg-terminal-green bg-opacity-10 text-center font-bold ${className}`;
        this.feedback.classList.remove('hidden');
    }

    showTerminalMessage(message, type = 'info') {
        const colors = {
            success: 'text-terminal-green-bright',
            error: 'text-red-400',
            warning: 'text-yellow-400',
            info: 'text-terminal-green'
        };
        
        this.feedback.textContent = `> ${message}`;
        this.feedback.className = `p-4 border border-terminal-green-dim bg-terminal-green bg-opacity-10 text-center font-bold ${colors[type]}`;
        this.feedback.classList.remove('hidden');
        
        setTimeout(() => {
            if (type !== 'success') {
                this.hideFeedback();
            }
        }, 3000);
    }

    updateDisplay() {
        this.attemptsLeft.textContent = this.attempts;
        this.totalGuesses.textContent = this.guesses.length;
        
        const accuracy = this.guesses.length > 0 ? 
            Math.round((1 / this.guesses.length) * 100) : 0;
        this.accuracy.textContent = `${accuracy}%`;
        
        this.gameStatus.textContent = this.gameActive ? 'ACTIVE' : 'TERMINATED';
    }

    updatePreviousGuesses() {
        if (this.guesses.length === 0) {
            this.hidePreviousGuesses();
            return;
        }
        
        this.guessList.innerHTML = '';
        this.guesses.forEach((guess, index) => {
            const guessElement = document.createElement('span');
            guessElement.className = 'px-3 py-1 border border-terminal-green-dim bg-terminal-green bg-opacity-10 text-terminal-green text-sm';
            guessElement.textContent = `${String(guess).padStart(3, '0')}`;
            this.guessList.appendChild(guessElement);
        });
        
        this.previousGuesses.classList.remove('hidden');
    }

    endGame(won) {
        this.gameActive = false;
        this.gameStatus.textContent = 'TERMINATED';
        
        let message = '';
        if (won) {
            const attemptsUsed = this.maxAttempts - this.attempts;
            message = `
                <div class="text-terminal-green-bright text-xl font-bold mb-4">
                    [MISSION ACCOMPLISHED]
                </div>
                <div class="text-terminal-green mb-2">
                    TARGET_NUMBER: ${this.targetNumber}
                </div>
                <div class="text-terminal-green mb-2">
                    ATTEMPTS_USED: ${attemptsUsed}/${this.maxAttempts}
                </div>
                <div class="text-terminal-green-dim">
                    EFFICIENCY_RATING: ${this.calculateRating(attemptsUsed)}
                </div>
            `;
        } else {
            message = `
                <div class="text-red-400 text-xl font-bold mb-4">
                    [MISSION FAILED]
                </div>
                <div class="text-terminal-green mb-2">
                    TARGET_NUMBER: ${this.targetNumber}
                </div>
                <div class="text-terminal-green mb-2">
                    ATTEMPTS_EXHAUSTED: ${this.maxAttempts}/${this.maxAttempts}
                </div>
                <div class="text-terminal-green-dim">
                    SYSTEM_STATUS: PROTOCOL_TIMEOUT
                </div>
            `;
        }
        
        this.gameOverMessage.innerHTML = message;
        this.gameContainer.classList.add('hidden');
        this.gameOverContainer.classList.remove('hidden');
        
        // Submit to leaderboard if won
        if (won) {
            const attemptsUsed = this.maxAttempts - this.attempts;
            setTimeout(() => {
                this.submitToLeaderboard(attemptsUsed);
            }, 1500);
        }
    }

    calculateRating(attempts) {
        if (attempts <= 3) return 'EXCELLENT';
        if (attempts <= 5) return 'GOOD';
        if (attempts <= 7) return 'AVERAGE';
        return 'POOR';
    }

    hideFeedback() {
        this.feedback.classList.add('hidden');
    }

    hidePreviousGuesses() {
        this.previousGuesses.classList.add('hidden');
    }

    hideGameOver() {
        this.gameContainer.classList.remove('hidden');
        this.gameOverContainer.classList.add('hidden');
    }
    
    /* Render leaderboard */
    renderLeaderboard() {
        if (typeof gameLeaderboard !== 'undefined' && gameLeaderboard && gameLeaderboard.isInitialized) {
            gameLeaderboard.renderLeaderboard('numguess', 'numguess-leaderboard', 'Number Guessing Leaderboard');
        } else {
            /* Retry after a short delay if leaderboard isn't ready */
            setTimeout(() => this.renderLeaderboard(), 100);
        }
    }
    
    /* Submit score to leaderboard */
    submitToLeaderboard(attemptsUsed) {
        if (typeof gameLeaderboard !== 'undefined' && gameLeaderboard && gameLeaderboard.isInitialized) {
            gameLeaderboard.showScoreSubmission('numguess', attemptsUsed, () => {
                this.renderLeaderboard();
            });
        }
    }
}

/* Game instance holder */
let gameInstance = null;

/* Initialize the Number Guessing Game */
function initializeNumberGuessingGame(options = {}) {
    const config = {
        enableDebug: false, 
        maxAttempts: 10,
        ...options
    };

    const guessInput = DOM.getElementById('guessInput');
    if (!guessInput) {
        return null;
    }

    try {
        gameInstance = new NumberGuessingGame();
        
        if (config.enableDebug) {
            Utils.debug('Number Guessing Game initialized successfully');
        }

        return {
            instance: gameInstance,
            isInitialized: true,
            destroy: () => {
                if (gameInstance) {
                    gameInstance = null;
                }
            }
        };
    } catch (error) {
        Utils.debug('Error initializing Number Guessing Game:', error);
        return null;
    }
}

export { NumberGuessingGame, initializeNumberGuessingGame };
