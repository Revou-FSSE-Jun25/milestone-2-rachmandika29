/* Rock Paper Scissors Game */

/* Import core functionality */
import { DOM, Utils } from "../cores/core.js";

class RockPaperScissorsGame {
  constructor() {
    this.gameState = {
      playerScore: 0,
      computerScore: 0,
      totalGames: 0,
      gameActive: true,
    };

    this.choices = ["rock", "paper", "scissors"];
    this.choiceEmojis = {
      rock: "🪨",
      paper: "📄",
      scissors: "✂️",
    };

    this.initializeElements();
    this.bindEvents();
    this.updateDisplay();
  }

  initializeElements() {
    this.playerScoreEl = DOM.getElementById("playerScore");
    this.computerScoreEl = DOM.getElementById("computerScore");
    this.totalGamesEl = DOM.getElementById("totalGames");
    this.winRateEl = DOM.getElementById("winRate");
    this.gameResultEl = DOM.getElementById("gameResult");
    this.playerChoiceEl = DOM.getElementById("playerChoice");
    this.computerChoiceEl = DOM.getElementById("computerChoice");
    this.rockBtn = DOM.getElementById("rockBtn");
    this.paperBtn = DOM.getElementById("paperBtn");
    this.scissorsBtn = DOM.getElementById("scissorsBtn");
    this.resetBtn = DOM.getElementById("resetBtn");
    this.gameHistoryEl = DOM.getElementById("gameHistory");
  }

  bindEvents() {
    if (this.rockBtn) {
      this.rockBtn.addEventListener("click", () => this.playGame("rock"));
    }
    if (this.paperBtn) {
      this.paperBtn.addEventListener("click", () => this.playGame("paper"));
    }
    if (this.scissorsBtn) {
      this.scissorsBtn.addEventListener("click", () =>
        this.playGame("scissors")
      );
    }
    if (this.resetBtn) {
      this.resetBtn.addEventListener("click", () => this.resetGame());
    }
  }

  playGame(playerChoice) {
    if (!this.gameState.gameActive) return;

    const computerChoice = this.getComputerChoice();
    const result = this.determineWinner(playerChoice, computerChoice);

    this.updateGameState(result);
    this.displayResult(playerChoice, computerChoice, result);
    this.updateDisplay();
    this.addToHistory(playerChoice, computerChoice, result);
  }

  getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * this.choices.length);
    return this.choices[randomIndex];
  }

  determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
      return "tie";
    }

    const winConditions = {
      rock: "scissors",
      paper: "rock",
      scissors: "paper",
    };

    return winConditions[playerChoice] === computerChoice ? "win" : "lose";
  }

  updateGameState(result) {
    this.gameState.totalGames++;

    if (result === "win") {
      this.gameState.playerScore++;
    } else if (result === "lose") {
      this.gameState.computerScore++;
    }
  }

  displayResult(playerChoice, computerChoice, result) {
    if (this.playerChoiceEl) {
      this.playerChoiceEl.textContent = `${
        this.choiceEmojis[playerChoice]
      } ${playerChoice.toUpperCase()}`;
    }

    if (this.computerChoiceEl) {
      this.computerChoiceEl.textContent = `${
        this.choiceEmojis[computerChoice]
      } ${computerChoice.toUpperCase()}`;
    }

    if (this.gameResultEl) {
      let resultText = "";
      let resultClass = "";

      switch (result) {
        case "win":
          resultText = "🎉 You Win!";
          resultClass = "text-green-500";
          break;
        case "lose":
          resultText = "😔 You Lose!";
          resultClass = "text-red-500";
          break;
        case "tie":
          resultText = "🤝 It's a Tie!";
          resultClass = "text-yellow-500";
          break;
      }

      this.gameResultEl.textContent = resultText;
      this.gameResultEl.className = `text-xl font-bold ${resultClass}`;
    }
  }

  updateDisplay() {
    if (this.playerScoreEl) {
      this.playerScoreEl.textContent = this.gameState.playerScore;
    }

    if (this.computerScoreEl) {
      this.computerScoreEl.textContent = this.gameState.computerScore;
    }

    if (this.totalGamesEl) {
      this.totalGamesEl.textContent = this.gameState.totalGames;
    }

    if (this.winRateEl && this.gameState.totalGames > 0) {
      const winRate = (
        (this.gameState.playerScore / this.gameState.totalGames) *
        100
      ).toFixed(1);
      this.winRateEl.textContent = `${winRate}%`;
    }
  }

  addToHistory(playerChoice, computerChoice, result) {
    if (!this.gameHistoryEl) return;

    const historyItem = document.createElement("div");
    historyItem.className =
      "flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded mb-2";

    const resultIcon =
      result === "win" ? "✅" : result === "lose" ? "❌" : "➖";

    historyItem.innerHTML = `
            <span>${this.choiceEmojis[playerChoice]} vs ${this.choiceEmojis[computerChoice]}</span>
            <span>${resultIcon}</span>
        `;

    this.gameHistoryEl.insertBefore(historyItem, this.gameHistoryEl.firstChild);

    /* Keep only last 10 games in history */
    while (this.gameHistoryEl.children.length > 10) {
      this.gameHistoryEl.removeChild(this.gameHistoryEl.lastChild);
    }
  }

  resetGame() {
    this.gameState = {
      playerScore: 0,
      computerScore: 0,
      totalGames: 0,
      gameActive: true,
    };

    this.updateDisplay();

    if (this.gameResultEl) {
      this.gameResultEl.textContent = "Choose your move!";
      this.gameResultEl.className =
        "text-xl font-bold text-gray-600 dark:text-gray-300";
    }

    if (this.playerChoiceEl) {
      this.playerChoiceEl.textContent = "❓ CHOOSE";
    }

    if (this.computerChoiceEl) {
      this.computerChoiceEl.textContent = "❓ WAITING";
    }

    if (this.gameHistoryEl) {
      this.gameHistoryEl.innerHTML = "";
    }
  }

  destroy() {
    /* Clean up event listeners and resources */
    this.gameState.gameActive = false;
  }
}

/* Game instance */
let gameInstance = null;

/* Initialize the Rock Paper Scissors Game */
function initializeRockPaperScissorsGame(options = {}) {
  const config = {
    enableDebug: false /* Set to true to enable debug logging */,
    ...options,
  };

  /* Only initialize if we're on the rock paper scissors page */
  const rockBtn = DOM.getElementById("rockBtn");
  if (!rockBtn) {
    return null;
  }

  try {
    Utils.debug("Initializing Rock Paper Scissors Game with config:", config);

    /* Create new game instance */
    gameInstance = new RockPaperScissorsGame();

    Utils.debug("Rock Paper Scissors Game initialized successfully");
    return gameInstance;
  } catch (error) {
    Utils.debug("Error initializing Rock Paper Scissors Game:", error);
    return null;
  }
}

export { RockPaperScissorsGame, initializeRockPaperScissorsGame };
