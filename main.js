import { LevelSelectionScene } from './scenes/LevelSelectionScene.js';
import { GameScene } from './scenes/GameScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
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
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  render: {
    pixelArt: false,
    antialias: true
  }
};

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Starting Mini Platformer Chrome Extension...');
  new Phaser.Game(config);
}); 