export class ScoreDisplay {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.score = 0;
    
    this.createScoreText();
  }

  createScoreText() {
    this.scoreText = this.scene.add.text(this.x, this.y, 'Score: 0', {
      fontSize: '20px',
      fill: '#fff',
      fontFamily: 'Arial',
      stroke: '#000',
      strokeThickness: 2
    });
    this.scoreText.setScrollFactor(0);
  }

  updateScore(points) {
    this.score += points;
    this.scoreText.setText('Score: ' + this.score);
  }

  setScore(score) {
    this.score = score;
    this.scoreText.setText('Score: ' + this.score);
  }

  getScore() {
    return this.score;
  }
  
  hide() {
    this.scoreText.setVisible(false);
  }

  show() {
    this.scoreText.setVisible(true);
  }
}
