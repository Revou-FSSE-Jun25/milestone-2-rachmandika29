# Mainkeun Game Studio - Landing Page

A retro-styled, responsive landing page for Mainkeun Game Studio featuring interactive JavaScript games with an authentic DEC VT320 terminal aesthetic.

## 🎮 Project Overview

Mainkeun is a game studio company specializing in browser-based JavaScript games. This landing page serves as the main hub for showcasing our games, leaderboards, company information, and contact details with a classic terminal computing experience.

## 📋 Pages Structure

The landing page consists of 5 main pages:

- **Home/Index Page** - Main landing page with hero section and featured content
- **Games Page** - Showcase of available games with interactive previews
- **Leaderboards Page** - Global and game-specific leaderboards
- **About Us Page** - Company information, team, and mission
- **Contact Us Page** - Contact form and company details

## 🛠️ Tech Stack

- **HTML5** - Semantic markup and structure
- **CSS3 with Tailwind CSS** - Utility-first CSS framework for rapid styling
- **JavaScript (ES6+)** - Modern JavaScript for interactivity and game logic
- **VT323 Font** - Google Fonts monospace font for authentic terminal feel

## 🎨 Design System - VT320 Terminal Theme

### Color Scheme
- **Background**: Pure Black (`#000000`) - Authentic terminal background
- **Primary Text**: Terminal Green (`#00ff41`) - Classic green phosphor display
- **Secondary Text**: Dim Green (`#00cc33`) - Subdued terminal text
- **Accent Color**: Bright Green (`#66ff66`) - Highlighted terminal elements
- **Border Color**: Dark Gray (`#333333`) - Terminal window borders

### Typography
- **Font Family**: VT323 - Authentic monospace terminal font from Google Fonts
- **Font Sizes**: Responsive scaling from 16px (mobile) to 20px+ (desktop)
- **Text Effects**: 
  - Glowing text shadows for authentic CRT monitor effect
  - Blinking cursor animations
  - Terminal typing effects

### Visual Effects
- **Scanlines**: CSS-generated horizontal scanlines to simulate CRT monitor
- **Text Glow**: Multiple text-shadow layers for phosphor glow effect
- **Terminal Borders**: Green borders around sections mimicking terminal windows
- **Hover Effects**: Enhanced glow and background highlights

## 🖥️ Terminal Aesthetic Features

### Visual Design Elements
- **Terminal Sections**: Each content section styled as terminal windows with `[SECTION]` labels
- **Command-Style Navigation**: Menu items formatted as `[HOME]`, `[GAMES]`, etc.
- **System Messages**: Content written in terminal/system language style
- **Cursor Animation**: Blinking underscore cursor for authentic terminal feel
- **Typing Animation**: Animated text appearance for main headings

### Interactive Elements
- **Terminal Buttons**: Green bordered buttons with hover glow effects
- **Input Fields**: Terminal-styled form inputs with green borders
- **Scrollbar**: Custom-styled scrollbar matching terminal theme
- **Mobile Menu**: Terminal-styled mobile navigation

## 🎯 Featured Games

The website showcases two fully-functional JavaScript-based games with integrated leaderboard systems:

### 1. Cookie Clicker Game
- **Description**: A fast-paced 30-second clicking challenge with terminal aesthetics
- **Core Features**: 
  - **Timed Gameplay**: 30-second rounds with countdown timer
  - **Click Mechanics**: Responsive clicking with visual feedback and animations
  - **Score System**: Real-time score tracking with formatted number display
  - **Visual Effects**: Animated click effects with +1 score popups
  - **Game States**: Start, active, and game over states with appropriate UI updates
  - **Leaderboard Integration**: Automatic score submission and ranking system
  - **Accessibility**: Keyboard support (Enter/Space) and screen reader friendly

### 2. Number Guessing Game
- **Description**: A terminal-styled number guessing challenge with strategic gameplay
- **Core Features**:
  - **Smart Difficulty**: Random number generation (1-100) with strategic hints
  - **Attempt System**: 10 attempts maximum with real-time tracking
  - **Intelligent Feedback**: Higher/lower hints with terminal-style messaging
  - **Performance Rating**: Efficiency scoring (Excellent/Good/Average/Poor)
  - **Game Statistics**: Accuracy percentage and attempt tracking
  - **Previous Guesses**: Visual history of all attempts with terminal styling
  - **Leaderboard Integration**: Score submission based on attempts used (lower is better)
  - **Terminal Aesthetics**: Complete VT320 terminal simulation with boot sequences

## 📁 Project Structure

```
mainkeun-landing-page/
├── index.html              # Home page with hero section and game previews
├── pages/
│   ├── games.html         # Games showcase page
│   ├── about.html         # About us page
│   ├── contact.html       # Contact page
│   ├── clicker.html       # Cookie Clicker game page
│   └── numguess.html      # Number Guessing game page
├── js/
│   ├── main.js            # Application entry point and module initialization
│   ├── cores/
│   │   ├── core.js        # Core utilities and configuration
│   │   └── utils.js       # Utility functions and storage management
│   ├── navigation/
│   │   └── navigation.js  # Navigation component and mobile menu
│   └── games/
│       ├── clicker.js     # Cookie Clicker game logic and mechanics
│       ├── guessing.js    # Number Guessing game logic and mechanics
│       └── leaderboard.js # Leaderboard system and score management
├── css/
│   └── main.css           # Tailwind CSS and custom terminal styling
└── README.md              # Project documentation
```

## 🎮 Detailed Game Logic & Features

### Cookie Clicker Game Logic:
- **Game State Management**: Tracks cookies, time remaining, game active status, and game started status
- **Timer System**: 30-second countdown with automatic game end when time expires
- **Click Handling**: 
  - Each click awards +1 cookie with immediate UI feedback
  - Visual click effects with animated score popups (+1 display)
  - Button scaling animation on click for tactile feedback
  - Keyboard accessibility (Enter/Space keys)
- **Score Tracking**: Real-time cookie count with formatted number display (K/M/B/T suffixes)
- **Game Flow**: Start → Active (30s) → End → Leaderboard Submission → Reset
- **UI Updates**: Dynamic status messages (CLICK_TO_START, GAME_ACTIVE, GAME_OVER)
- **Leaderboard Integration**: Automatic score submission with player name input modal

### Number Guessing Game Logic:
- **Game Initialization**: Random target number generation (1-100) with 10 maximum attempts
- **Input Validation**: 
  - Range checking (1-100)
  - Duplicate guess prevention
  - Invalid input handling with terminal-style error messages
- **Feedback System**: 
  - Intelligent hints ("ANALYSIS: X < TARGET_NUMBER. INCREASE VALUE.")
  - Terminal-styled messaging with color coding (green/yellow/red)
  - Success/failure state management
- **Statistics Tracking**: 
  - Attempts remaining counter
  - Total guesses made
  - Accuracy percentage calculation
  - Previous guesses history with terminal styling
- **Performance Rating**: Efficiency scoring based on attempts used (≤3: Excellent, ≤5: Good, ≤7: Average, >7: Poor)
- **Game Flow**: Initialize → Guess Loop → Win/Lose → Leaderboard (if won) → Reset
- **Leaderboard Integration**: Score submission based on attempts used (lower attempts = better score)

## 📊 Advanced Leaderboard System

### Core Features:
- **Game-Specific Rankings**: Separate leaderboards for Cookie Clicker and Number Guessing
- **Local Storage**: Persistent score storage using browser localStorage with "leaderboard_" prefix
- **Smart Scoring**: 
  - Cookie Clicker: Higher scores ranked first (descending order)
  - Number Guessing: Lower attempts ranked first (ascending order)
- **Top 10 Tracking**: Maximum 10 entries per game with automatic pruning
- **Score Validation**: New record detection and qualification checking

### User Interface:
- **Score Submission Modal**: Post-game modal with player name input and skip option
- **Formatted Display**: 
  - Medal system (🥇🥈🥉) for top 3 positions
  - Formatted scores ("X cookies" vs "X attempts")
  - Timestamp display with date and time
  - Terminal-styled presentation matching game aesthetics
- **Management Features**: 
  - Clear leaderboard functionality with confirmation dialog
  - Real-time leaderboard updates after score submission
  - Anonymous player support (default "Anonymous" name)

### Technical Implementation:
- **Modular Design**: Standalone leaderboard class with game integration
- **Event-Driven**: Custom events for score submission and updates
- **Storage Management**: Robust localStorage handling with error recovery
- **Cross-Game Compatibility**: Unified system supporting multiple game types

## 🏗️ Application Architecture

### Module System:
- **Core Architecture**: ES6 module-based application with centralized initialization
- **Application Class**: Main application controller managing all game modules
- **Module Management**: 
  - Navigation system with mobile menu support
  - Utility functions with smooth scrolling and form validation
  - Leaderboard system with cross-game compatibility
  - Individual game instances (Cookie Clicker & Number Guessing)

### Initialization Flow:
1. **DOM Ready**: Application starts when DOM content is loaded
2. **Core Initialization**: Core utilities and configuration setup
3. **Navigation Setup**: Mobile and desktop navigation initialization
4. **Utilities Loading**: Smooth scroll, form validation, and storage management
5. **Leaderboard System**: Centralized scoring system initialization
6. **Game Loading**: Conditional game initialization based on current page
7. **Global Access**: Module instances available globally for cross-component communication

### Key Features:
- **Modular Design**: Each component is self-contained with clear interfaces
- **Error Handling**: Comprehensive error catching and logging throughout
- **Debug Support**: Built-in debug mode with detailed logging
- **Event System**: Custom events for inter-module communication
- **Cleanup Management**: Proper resource cleanup on page unload
- **Page Detection**: Smart initialization based on current page context

## 🎨 Styling Guidelines

### Tailwind CSS Classes
- Use utility classes for consistent spacing and sizing
- Implement responsive design with Tailwind's breakpoint prefixes
- Utilize custom color palette defined in Tailwind config

### Custom CSS
- Minimal custom CSS for unique styling needs
- CSS variables for theme consistency
- Smooth animations and transitions

## 📱 Responsive Design

- **Mobile-First Approach**: Optimized for mobile devices
- **Breakpoints**: 
  - Mobile: 320px - 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px+
- **Touch-Friendly**: Large buttons and touch targets

## 🔧 Development Guidelines

### JavaScript (ES6+)
- Use modern JavaScript features (arrow functions, destructuring, modules)
- Implement proper error handling
- Follow clean code principles
- Use local storage for game progress

### HTML5
- Semantic HTML elements
- Proper accessibility attributes
- SEO-friendly structure

### CSS/Tailwind
- Utility-first approach
- Consistent spacing and typography
- Smooth animations and transitions

## 🚀 Deployment

The website will be deployed on
- **Vercel**: Fast deployment with automatic HTTPS
- **Hostinger Shared Hosting**: For full stable hosting enviornment.