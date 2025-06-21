# 🎮 Mini Platformer Chrome Extension - Installation Guide

## Quick Start (5 minutes)

### Step 1: Download the Extension
- **Option A**: Use the `mini-platformer-extension.zip` file
- **Option B**: Use the folder directly if you have the source code

### Step 2: Extract (if using ZIP)
1. Right-click `mini-platformer-extension.zip`
2. Select "Extract All" or "Extract Here"
3. Note the folder location

### Step 3: Load in Chrome
1. Open **Google Chrome**
2. Type `chrome://extensions/` in the address bar
3. **Enable "Developer mode"** (toggle in top-right corner)
4. Click **"Load unpacked"**
5. Select the folder containing the extension files
6. Click **"Select Folder"**

### Step 4: Start Playing!
1. **Pin the extension** to your toolbar (click the puzzle piece icon)
2. **Click the green game icon** in your toolbar
3. **Enjoy the game!** 🎮

## 📁 Required Files

Make sure your extension folder contains:
```
✅ manifest.json
✅ index.html
✅ main.js
✅ icon.png
✅ scenes/LevelSelectionScene.js
✅ scenes/GameScene.js
✅ entities/Player.js
✅ entities/Enemy.js
✅ ui/ScoreDisplay.js
✅ ui/HeartDisplay.js
✅ ui/GameOverScreen.js
✅ assets/ (folder with images and audio)
```

## 🎯 How to Play

### Controls
- **← →**: Move left and right
- **↑ / Space**: Jump
- **Collect coins** to increase score
- **Avoid or defeat enemies** by jumping on them
- **Complete Level 1** to unlock Level 2

### Game Features
- **Two challenging levels** with different themes
- **Persistent scoring** across levels
- **Enemy encounters** and combat
- **Smooth platformer mechanics**
- **Works completely offline**

## 🔧 Troubleshooting

### Extension Won't Load?
- ✅ Check that Developer Mode is enabled
- ✅ Verify all files are in the same folder
- ✅ Make sure `manifest.json` is valid
- ✅ Try refreshing the extensions page

### Game Doesn't Start?
- ✅ Check browser console for errors (F12)
- ✅ Ensure Phaser.js loads correctly
- ✅ Try refreshing the extension
- ✅ Check internet connection (for initial Phaser load)

### Performance Issues?
- ✅ Close other tabs to free memory
- ✅ Restart Chrome if needed
- ✅ Check if other extensions are interfering

## 🚀 Advanced Setup

### For Developers
1. **Clone the repository** for development
2. **Make changes** to the game files
3. **Reload the extension** in Chrome
4. **Test your changes** immediately

### Customization
- **Modify game mechanics** in `scenes/GameScene.js`
- **Change UI elements** in the `ui/` folder
- **Add new levels** by extending the scene system
- **Update graphics** in the `assets/` folder

## 📞 Support

If you encounter issues:
1. Check the browser console (F12) for error messages
2. Verify all files are present and not corrupted
3. Try reinstalling the extension
4. Check Chrome's extension permissions

## 🎉 Success!

Once installed, you'll have a fun platformer game that:
- ✅ Works offline
- ✅ Loads instantly
- ✅ Saves your progress
- ✅ Provides hours of entertainment

**Happy gaming!** 🎮✨ 