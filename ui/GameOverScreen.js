export class GameOverScreen {
  constructor(scene) {
    this.scene = scene;

    this.container = this.scene.add.container(400, 300).setVisible(false);
    this.container.setDepth(1000);

    // Simple game over text
    const gameOverTitle = this.scene.add.text(0, -30, 'Game Over', { 
      fontSize: '36px',
      fill: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5);
    
    // Simple score text
    this.scoreText = this.scene.add.text(0, 10, 'Score: 0', { 
      fontSize: '24px', 
      fill: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5);
    
    // Simple restart text
    const restartText = this.scene.add.text(0, 50, 'Press R to Restart', { 
      fontSize: '18px', 
      fill: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5);
    
    this.container.add([gameOverTitle, this.scoreText, restartText]);
  }

  show(score, onRestartCallback) {
    if (score === undefined || score === null) {
      score = 0;
    }
    
    this.scoreText.setText(`Score: ${score}`);
    
    const cam = this.scene.cameras.main;
    this.container.setPosition(cam.scrollX + cam.width / 2, cam.scrollY + cam.height / 2);
    this.container.setVisible(true);

    this.scene.input.keyboard.once('keydown-R', () => {
      onRestartCallback();
    });
  }

  hide() {
    this.container.setVisible(false);
  }
}
