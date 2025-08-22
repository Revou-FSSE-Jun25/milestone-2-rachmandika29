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

The website showcases JavaScript-based games including:

### 1. Clicker Game
- **Description**: An addictive incremental clicking game
- **Features**: 
  - Click to earn points
  - Upgrades and multipliers
  - Achievement system
  - Local storage for progress saving

### 2. Number Guessing Game
- **Description**: A classic number guessing challenge
- **Features**:
  - Random number generation
  - Hint system (higher/lower)
  - Score tracking
  - Difficulty levels

## 📁 Project Structure

```
mainkeun-landing-page/
├── index.html              # Home page
├── pages/
│   ├── games.html         # Games showcase
│   ├── leaderboards.html  # Leaderboards
│   ├── about.html         # About us
│   └── contact.html       # Contact page
├── js/
│   ├── main.js            # Main JavaScript
│   ├── games/
│   │   ├── clicker.js     # Clicker game logic
│   │   └── guessing.js    # Number guessing game
│   └── components/
│       ├── navigation.js  # Navigation component
│       └── leaderboard.js # Leaderboard functionality
├── assets/
│   ├── images/            # Images and graphics
│   └── icons/             # Icon files
└── README.md              # Project documentation
```

## 🎮 Game Features

### Clicker Game Features:
- **Auto-clickers**: Automated clicking mechanisms
- **Upgrades**: Various power-ups and multipliers
- **Prestige System**: Reset progress for permanent bonuses
- **Statistics**: Detailed game statistics and achievements

### Number Guessing Game Features:
- **Multiple Difficulty Levels**: Easy (1-10), Medium (1-50), Hard (1-100)
- **Hint System**: Smart hints to guide players
- **Timer Mode**: Time-based challenges
- **High Score Tracking**: Personal best records

## 📊 Leaderboard System

- **Global Leaderboards**: Cross-game rankings
- **Game-Specific Rankings**: Individual game leaderboards
- **Real-time Updates**: Live score updates
- **Player Profiles**: Basic player information and statistics

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