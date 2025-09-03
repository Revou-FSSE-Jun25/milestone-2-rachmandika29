/* Cookie Clicker Game */

import { DOM, Utils } from "../cores/core.js";
import { initializeNavigation } from "../navigation/navigation.js";

class CookieClickerGame {
  constructor() {
    this.gameState = {
      cookies: 0,
      timeRemaining: 30, 
      gameActive: false,
      gameStarted: false,
    };

    this.elements = {};
    this.gameTimer = null;
  }

  /* Initialize game */
  async init() {
    try {
      Utils.logMessage("Initializing Cookie Clicker Game...");

      /* Initialize navigation */
      await initializeNavigation();

      /* Cache elements */
      this.cacheElements();

      /* Setup listeners */
      this.setupEventListeners();

      /* Initial UI update */
      this.updateUI();
      this.renderLeaderboard();

      Utils.logMessage("Cookie Clicker Game initialized successfully!");
    } catch (error) {
      console.error("Failed to initialize Cookie Clicker Game:", error);
    }
  }

  /* Cache DOM elements */
  cacheElements() {
    this.elements = {
      mainClicker: DOM.getElementById("mainClicker"),
      totalScore: DOM.getElementById("totalScore"),
      timeRemaining: DOM.getElementById("timeRemaining"),
      gameStatus: DOM.getElementById("gameStatus"),
      startButton: DOM.getElementById("startButton"),
      resetButton: DOM.getElementById("resetGameBtn"),
      clickEffects: DOM.getElementById("clickEffects"),
    };
  }

  /* Setup event listeners */
  setupEventListeners() {
    /* Main clicker */
    this.elements.mainClicker.addEventListener("click", (e) =>
      this.handleClick(e)
    );
    this.elements.mainClicker.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.handleClick(e);
      }
    });

    /* Start button */
    if (this.elements.startButton) {
      this.elements.startButton.addEventListener("click", () =>
        this.startGame()
      );
    }

    /* Reset button */
    if (this.elements.resetButton) {
      this.elements.resetButton.addEventListener("click", () =>
        this.resetGame()
      );
    }
  }

  /* Handle clicks */
  handleClick(event) {
    /* Check game active */
    if (!this.gameState.gameActive) {
      if (!this.gameState.gameStarted) {
        this.startGame();
      }
      return;
    }

    const clickValue = 1;
    this.gameState.cookies += clickValue;

    /* Create effect */
    this.createClickEffect(event, clickValue);

    /* Click animation */
    this.elements.mainClicker.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.elements.mainClicker.style.transform = "scale(1)";
    }, 100);

    /* Update UI */
    this.updateUI();

    Utils.logMessage(
      `Clicked! Got ${clickValue} cookies. Total: ${this.gameState.cookies}`
    );
  }

  /* Start game */
  startGame() {
    this.gameState.gameActive = true;
    this.gameState.gameStarted = true;
    this.gameState.timeRemaining = 30
    this.gameState.cookies = 0;

    this.startTimer();
    this.updateUI();

    Utils.logMessage("Cookie Clicker Game started!");
  }

  /* Reset game */
  resetGame() {
    this.gameState.gameActive = false;
    this.gameState.gameStarted = false;
    this.gameState.timeRemaining = 30;
    this.gameState.cookies = 0;
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }

    this.updateUI();

    Utils.logMessage("Cookie Clicker Game reset!");
  }

  /* Start timer */
  startTimer() {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }

    this.gameTimer = setInterval(() => {
      this.gameState.timeRemaining--;
      this.updateUI();

      if (this.gameState.timeRemaining <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  /* End game */
  endGame() {
    this.gameState.gameActive = false;

    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }

    this.updateUI();

    /* Submit to leaderboard */
    setTimeout(() => {
      this.submitToLeaderboard(this.gameState.cookies);
    }, 1000);

    Utils.logMessage(
      `Game ended! Final score: ${this.gameState.cookies} cookies`
    );
  }

  /* Create click effect */
  createClickEffect(event, value) {
    const effect = document.createElement("div");
    effect.className =
      "click-effect absolute text-2xl font-bold text-yellow-400 pointer-events-none animate-bounce";
    effect.textContent = `+${Utils.formatNumber(value)}`;
    effect.style.left = "50%";
    effect.style.top = "50%";
    effect.style.transform = "translate(-50%, -50%)";
    effect.style.zIndex = "10";

    this.elements.clickEffects.appendChild(effect);

    /* Animate and remove */
    setTimeout(() => {
      effect.style.opacity = "0";
      effect.style.transform = "translate(-50%, -100px)";
      effect.style.transition = "all 1s ease-out";
    }, 100);

    setTimeout(() => {
      if (effect.parentNode) {
        effect.parentNode.removeChild(effect);
      }
    }, 1100);
  }

  /* Update UI elements */
  updateUI() {
    this.elements.totalScore.textContent = Utils.formatNumber(
      this.gameState.cookies
    );

    /* Update timer */
    if (this.elements.timeRemaining) {
      const minutes = Math.floor(this.gameState.timeRemaining / 60);
      const seconds = this.gameState.timeRemaining % 60;
      this.elements.timeRemaining.textContent = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }

    /* Update status */
    if (this.elements.gameStatus) {
      if (!this.gameState.gameStarted) {
        this.elements.gameStatus.textContent = "CLICK_TO_START";
      } else if (this.gameState.gameActive) {
        this.elements.gameStatus.textContent = "GAME_ACTIVE";
      } else {
        this.elements.gameStatus.textContent = "GAME_OVER";
      }
    }

    /* Update button visibility */
    if (this.elements.startButton) {
      this.elements.startButton.style.display = this.gameState.gameStarted
        ? "none"
        : "block";
    }
  }

  /* Render leaderboard */
  renderLeaderboard() {
    if (
      typeof gameLeaderboard !== "undefined" &&
      gameLeaderboard &&
      gameLeaderboard.isInitialized
    ) {
      gameLeaderboard.renderLeaderboard(
        "clicker",
        "clicker-leaderboard",
        "Cookie Clicker Leaderboard"
      );
    } else {
      /* Retry if not ready */
      setTimeout(() => this.renderLeaderboard(), 100);
    }
  }

  /* Submit score */
  submitToLeaderboard(finalScore) {
    if (
      typeof gameLeaderboard !== "undefined" &&
      gameLeaderboard &&
      gameLeaderboard.isInitialized
    ) {
      gameLeaderboard.showScoreSubmission(
        "clicker",
        Math.floor(finalScore),
        () => {
          this.renderLeaderboard();
        }
      );
    }
  }

  /* Cleanup on page leave */
  destroy() {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
  }
}

/* Game instance */
let gameInstance = null;

/* Initialize Cookie Clicker Game */
function initializeCookieClicker(options = {}) {
  const config = {
    enableDebug: false,
    autoStart: true,
    ...options,
  };

  /* Check if on clicker page */
  const mainClicker = DOM.getElementById("mainClicker");
  if (!mainClicker) {
    return null;
  }

  try {
    gameInstance = new CookieClickerGame();

    /* Initialize game */
    gameInstance
      .init()
      .then(() => {
        if (config.enableDebug) {
          console.log("Cookie Clicker Game initialized successfully");
        }
      })
      .catch((error) => {
        console.error("Failed to initialize Cookie Clicker Game:", error);
      });

    /* Setup cleanup */
    window.addEventListener("beforeunload", () => {
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
      },
    };
  } catch (error) {
    console.error("Error initializing Cookie Clicker Game:", error);
    return null;
  }
}

export { CookieClickerGame, initializeCookieClicker };
