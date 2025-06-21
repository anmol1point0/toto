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
      fill: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: '#000000',
        blur: 2,
        fill: true
      }
    });
    this.scoreText.setScrollFactor(0);
    this.scoreText.setDepth(100); // Ensure it's always on top
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
