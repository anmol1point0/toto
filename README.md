# Mini Platformer Chrome Extension

A fun Mario-style platformer game that works as a Chrome Extension, similar to the Chrome Dinosaur Game.

## Features

- 🎮 Two challenging levels with different themes
- 🪙 Coin collection and scoring system
- 👾 Enemy encounters and combat
- 🏃‍♂️ Smooth platformer mechanics
- 🎯 Level progression system
- 📱 Works offline in Chrome

## Installation

### Method 1: Load Unpacked (Recommended)

1. **Download/Clone** this repository to your computer
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** by toggling the switch in the top right
4. **Click "Load Unpacked"** and select the folder containing this extension
5. **Pin the extension** to your toolbar for easy access
6. **Click the extension icon** to start playing!

### Method 2: Install from ZIP

1. **Download** the extension files as a ZIP
2. **Extract** the ZIP file to a folder
3. Follow steps 2-6 from Method 1

## How to Play

- **Arrow Keys**: Move left/right and jump
- **Space**: Jump (alternative)
- **Collect coins** to increase your score
- **Avoid enemies** or defeat them by jumping on them
- **Complete Level 1** to unlock Level 2
- **Don't fall into pits!**

## Game Controls

- **← →**: Move left and right
- **↑ / Space**: Jump
- **Double-tap jump**: Double jump (if available)

## File Structure

```
mini-platformer-extension/
├── manifest.json          # Extension configuration
├── index.html             # Main game page
├── main.js                # Game entry point
├── icon.png               # Extension icon
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

## Troubleshooting

### Extension won't load?
- Make sure Developer Mode is enabled
- Check that all files are in the same folder
- Verify the manifest.json is valid

### Game doesn't start?
- Check the browser console for errors
- Ensure Phaser.js is loading correctly
- Try refreshing the extension

### Performance issues?
- Close other tabs to free up memory
- Restart Chrome if needed

## Development

This extension uses:
- **Phaser 3.60.0** for game engine
- **Manifest V3** for Chrome Extension
- **ES6 Modules** for code organization

## License

This project is open source and available under the MIT License.

---

**Enjoy playing Mini Platformer!** 🎮 