# Mini Platformer Chrome Extension

A fun Mario-style platformer game that works as a Chrome Extension, similar to the Chrome Dinosaur Game.

## Features

- **Self-contained**: No external dependencies - everything runs offline
- **Chrome Extension**: Works as a browser extension
- **Two Levels**: Different gameplay experiences
- **Procedural Generation**: Endless platformer gameplay
- **Score System**: Persistent score tracking
- **Responsive Design**: Optimized for 931x580 dimensions

## Game Dimensions

- **Width**: 931 pixels
- **Height**: 580 pixels
- **Aspect Ratio**: ~1.6:1 (widescreen)

## Self-Contained Assets

All assets are included locally:
- **Phaser Library**: `phaser.min.js` (local copy)
- **Poki Plugin**: `poki-plugin.js` (offline-compatible)
- **Game Assets**: All images and audio in `assets/` folder
- **No CDN Dependencies**: Everything works offline

## Installation

### For Development
```bash
npm install
npm start
```
Then open `http://localhost:8000` in your browser.

### For Chrome Extension
1. Run `npm run build` to create the extension package
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extracted folder
5. The game will appear as a Chrome extension

## Game Controls

- **Arrow Keys**: Move left/right
- **Spacebar**: Jump
- **F1**: Debug - test game over screen

## Level Differences

### Level 1: Classic Platformer
- Standard difficulty
- Regular coin placement
- Normal enemy spawning

### Level 2: Cave of Coins
- Dark theme
- Higher coin placement (more challenging)
- Reduced enemy spawning for balance
- Longer level

## Technical Details

- **Engine**: Phaser 3.60.0
- **Physics**: Arcade physics system
- **Rendering**: Canvas-based
- **Audio**: Local MP3 files (not currently loaded)
- **Storage**: Browser localStorage for score persistence

## File Structure

```
game/
├── main.js                 # Game configuration (931x580)
├── index.html             # Main HTML file
├── manifest.json          # Chrome extension manifest
├── phaser.min.js          # Local Phaser library
├── poki-plugin.js         # Offline Poki plugin
├── assets/                # Game assets
│   ├── images/           # Sprites and textures
│   └── audio/            # Sound effects and music
├── scenes/               # Game scenes
├── entities/             # Game objects
├── ui/                   # User interface components
├── graphics/             # Graphics utilities
└── shared/               # Shared utilities
```

## Build Process

The build process creates a Chrome extension package:
- Includes all local assets
- Excludes development files
- Creates a self-contained zip file

## Offline Functionality

The game is designed to work completely offline:
- No external CDN dependencies
- All libraries included locally
- Mock Poki SDK for offline compatibility
- Local asset loading

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build Chrome extension
npm run build

# Clean build artifacts
npm run clean
```

## License

MIT License - feel free to use and modify!

---

**Enjoy playing Mini Platformer!** 🎮 