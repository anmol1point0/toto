# Mini Platformer Chrome Extension

A fun Mario-style platformer game that works as a Chrome Extension, similar to the Chrome Dinosaur Game.

## Features

- 🎮 Two challenging levels with different themes
- 🪙 Coin collection and scoring system
- 👾 Enemy encounters and combat
- 🏃‍♂️ Smooth platformer mechanics
- 🎯 Level progression system
- 📱 Works offline in Chrome

## Quick Start

### Prerequisites
- Node.js (>= 14.0.0)
- Google Chrome browser

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anmol1point0/toto.git
   cd toto
   ```

2. **Install dependencies (if any):**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   # or
   npm run dev
   ```

4. **Open in browser:**
   - Go to `http://localhost:8000`
   - Or load as Chrome Extension (see below)

## Chrome Extension Installation

### Method 1: Load Unpacked (Recommended)

1. **Open Chrome** and navigate to `chrome://extensions/`
2. **Enable Developer Mode** by toggling the switch in the top right
3. **Click "Load Unpacked"** and select the project folder
4. **Pin the extension** to your toolbar for easy access
5. **Click the extension icon** to start playing!

### Method 2: Build and Install

1. **Build the extension:**
   ```bash
   npm run build
   ```

2. **Load the generated ZIP** in Chrome extensions

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run dev` - Start development server (alias)
- `npm run serve` - Start development server (alias)
- `npm run build` - Build Chrome Extension ZIP
- `npm run clean` - Remove build artifacts
- `npm test` - Run tests (placeholder)
- `npm run lint` - Run linter (placeholder)

### Project Structure

```
mini-platformer-extension/
├── manifest.json          # Extension configuration
├── index.html             # Main game page
├── main.js                # Game entry point
├── icon.png               # Extension icon
├── package.json           # Node.js configuration
├── .gitignore            # Git ignore rules
├── scenes/                # Game scenes
│   ├── LevelSelectionScene.js
│   └── GameScene.js
├── entities/              # Game entities
│   ├── Player.js
│   ├── Enemy.js
│   └── index.js
├── ui/                    # User interface
│   ├── ScoreDisplay.js
│   ├── HeartDisplay.js
│   ├── GameOverScreen.js
│   └── index.js
├── graphics/              # Graphics utilities
│   ├── Graphics.js
│   └── index.js
├── shared/                # Shared utilities
│   └── Logger.js
└── assets/                # Game assets
    ├── audio/
    └── images/
```

## How to Play

### Controls
- **Arrow Keys**: Move left/right and jump
- **Space**: Jump (alternative)
- **Collect coins** to increase your score
- **Avoid enemies** or defeat them by jumping on them
- **Complete Level 1** to unlock Level 2
- **Don't fall into pits!**

### Game Features
- **Two challenging levels** with different themes
- **Persistent scoring** across levels
- **Enemy encounters** and combat
- **Smooth platformer mechanics**
- **Works completely offline**

## Troubleshooting

### Extension Won't Load?
- Make sure Developer Mode is enabled
- Check that all files are in the same folder
- Verify the manifest.json is valid

### Game Doesn't Start?
- Check the browser console for errors (F12)
- Ensure Phaser.js loads correctly
- Try refreshing the extension

### Development Issues?
- Make sure Node.js is installed (>= 14.0.0)
- Run `npm install` if dependencies are missing
- Check console for any error messages

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

This extension uses:
- **Phaser 3.60.0** for game engine
- **Manifest V3** for Chrome Extension
- **ES6 Modules** for code organization
- **Node.js** for development tools

## License

This project is open source and available under the MIT License.

---

**Enjoy playing Mini Platformer!** 🎮 