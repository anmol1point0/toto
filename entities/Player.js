export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 1); // Set origin to bottom-center to match enemies
    this.setBounce(0.2);
    this.setCollideWorldBounds(false); // We handle falling death manually in game.js
    // NOTE: We are intentionally not setting gravity here to use the world default.

    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    // Horizontal Movement
    if (this.cursors.left.isDown) {
      this.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(200);
    } else {
      this.setVelocityX(0);
    }

    // Vertical Movement
    if (this.cursors.up.isDown && (this.body.touching.down || this.body.blocked.down)) {
      this.setVelocityY(-400);
    }
  }

  die(onComplete) {
    console.log('[PLAYER] Player die method called');
    this.body.setEnable(false);
    this.setTint(0xff0000);
    this.setVelocity(-50, -250);
    
    this.scene.tweens.add({
      targets: this,
      angle: 360,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        console.log('[PLAYER] Player die animation completed');
        if (onComplete) onComplete();
      }
    });
  }
}
