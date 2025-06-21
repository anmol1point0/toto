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
    const oldScore = this.score;
    this.score += points;
    this.scoreText.setText('Score: ' + this.score);
    console.log(`[SCORE] Score updated: ${oldScore} + ${points} = ${this.score}`);
  }

  setScore(score) {
    const oldScore = this.score;
    this.score = score;
    this.scoreText.setText('Score: ' + this.score);
    console.log(`[SCORE] Score set: ${oldScore} -> ${this.score}`);
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
