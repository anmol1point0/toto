export class GameOverScreen {
  constructor(scene) {
    this.scene = scene;

    const style = {
      fontSize: '48px',
      fill: '#ff0000',
      fontFamily: 'Arial',
      align: 'center',
      stroke: '#000',
      strokeThickness: 4
    };

    this.container = this.scene.add.container(400, 300).setVisible(false);

    const gameOverTitle = this.scene.add.text(0, -60, 'Game Over', style).setOrigin(0.5);
    this.scoreText = this.scene.add.text(0, 20, 'Score: 0', { ...style, fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    const restartText = this.scene.add.text(0, 80, 'Press R to Restart', { ...style, fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    
    this.container.add([gameOverTitle, this.scoreText, restartText]);
  }

  show(score, onRestartCallback) {
    this.scoreText.setText('Your Score: ' + score);
    this.container.setVisible(true);
    this.container.setAlpha(0);

    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      duration: 500,
      ease: 'Power2'
    });

    this.scene.input.keyboard.once('keydown-R', onRestartCallback);
  }

  hide() {
    this.container.setVisible(false);
  }
}
