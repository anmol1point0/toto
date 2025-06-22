import { LevelSelectionScene } from './scenes/LevelSelectionScene.js';
import { GameScene } from './scenes/GameScene.js';

const config = {
  type: Phaser.AUTO,
  width: 1031,
  height: 580,
  backgroundColor: '#87CEEB', // Sky Blue - organic and nature-resembling
  parent: 'game-container', // Target the game container div
  physics: { 
    default: 'arcade', 
    arcade: { 
      gravity: { y: 500 } 
    } 
  },
  scene: [LevelSelectionScene, GameScene], // Start with LevelSelectionScene first
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game-container',
    width: 1031,
    height: 580
  },
  render: {
    pixelArt: false,
    antialias: true
  },
  plugins: {
    global: [
      {
        plugin: window.PokiPlugin,
        key: 'poki',
        start: true, // must be true, in order to load
        data: {
          // This must be the key/name of your loading scene
          loadingSceneKey: 'LevelSelectionScene',
          // This must be the key/name of your game (gameplay) scene
          gameplaySceneKey: 'LevelSelectionScene',
          // This will always request a commercialBreak when gameplay starts,
          // set to false to disable this behaviour (recommended to have true,
          // see Poki SDK docs for more details).
          autoCommercialBreak: true
        }
      }
    ]
  }
};

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Starting Mini Platformer Chrome Extension...');
  new Phaser.Game(config);
}); 