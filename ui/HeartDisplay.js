export class HeartDisplay extends Phaser.GameObjects.Group {
  constructor(scene, maxLives = 3) {
    super(scene);
    this.maxLives = maxLives;
    this.currentLives = maxLives;
    
    this.createHearts();
    scene.add.existing(this);
  }

  createHearts() {
    const heartSpacing = 36; // Spacing between hearts
    const rightPadding = 40; // Space from the right edge of the screen
    const topPadding = 20;   // Space from the top
    const cameraWidth = this.scene.cameras.main.width;

    // Correctly calculate the starting X position to be right-aligned
    const startX = cameraWidth - (this.maxLives * heartSpacing) - rightPadding;

    for (let i = 0; i < this.maxLives; i++) {
      const heart = this.scene.add.sprite(
        startX + (i * heartSpacing),
        topPadding,
        'heart'
      );
      heart.setOrigin(0, 0);
      heart.setScale(1);
      heart.setScrollFactor(0); // Pin to camera
      this.add(heart);
    }
  }

  updateLives(lives) {
    const oldLives = this.currentLives;
    this.currentLives = Math.max(0, Math.min(lives, this.maxLives));
    
    console.log(`[HEARTS] Lives updated: ${oldLives} -> ${this.currentLives}`);
    
    this.getChildren().forEach((heart, index) => {
        heart.setVisible(index < this.currentLives);
    });
  }
}
