export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, player, texture = 'enemy') {
    super(scene, x, y, texture);
    this.player = player;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 1);
    this.setScale(0.8);
    this.setBounce(0.4);
    this.setCollideWorldBounds(true);
    
    this.decisionTimer = scene.time.addEvent({
        delay: Phaser.Math.Between(1000, 2500),
        callback: this.makeDecision,
        callbackScope: this,
        loop: true
    });
  }

  // Custom destroy method to clean up the timer
  destroy(fromScene) {
    if (this.decisionTimer) {
      this.decisionTimer.remove();
    }
    super.destroy(fromScene);
  }

  makeDecision() {
    // Safety check: if the body or player doesn't exist, do nothing.
    if (!this.body || !this.player) {
      this.setVelocityX(Phaser.Math.RND.pick([-50, 50]));
      this.decisionTimer.delay = Phaser.Math.Between(800, 2000);
      return;
    }
    
    const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
    
    if (distanceToPlayer > 350) {
        const randomVelocity = Phaser.Math.RND.pick([-50, 50]);
        this.setVelocityX(randomVelocity);
    } else {
        const direction = Math.sign(this.player.x - this.x);
        this.setVelocityX(direction * 80);
        
        if (Math.random() < 0.4 && this.body.touching.down) {
            this.setVelocityY(-350);
        }
    }
    
    this.decisionTimer.delay = Phaser.Math.Between(800, 2000);
  }
  
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    
    if (this.body.velocity.x > 0) this.flipX = false;
    else if (this.body.velocity.x < 0) this.flipX = true;
  }
}
