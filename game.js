let player, platforms, cursors, coins, score = 0, scoreText;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#87ceeb', // Sky blue
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
  this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
  this.load.image('coin', 'https://i.imgur.com/WP6tXoJ.png'); // Better coin
}

function create() {
  // Ground/platform setup
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  // Player setup
  player = this.physics.add.sprite(100, 450, 'player');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  // Add physics collision with ground
  this.physics.add.collider(player, platforms);

  // Keyboard input
  cursors = this.input.keyboard.createCursorKeys();

  // Create coins
  createCoins.call(this);

  // Create score HUD
  scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '20px',
    fill: '#fff',
    fontFamily: 'Arial'
  });
}

function update() {
  // Horizontal movement
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
  } else {
    player.setVelocityX(0);
  }

  // Jumping
  if (cursors.up.isDown && player.body.blocked.down) {
    player.setVelocityY(-330);
  }
}

function createCoins() {
  coins = this.physics.add.group({
    key: 'coin',
    repeat: 10,
    setXY: { x: 40, y: 0, stepX: 70 }
  });

  coins.children.iterate((coin) => {
    coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    coin.setScale(0.5); // resize for better fit
  });

  this.physics.add.collider(coins, platforms);
  this.physics.add.overlap(player, coins, collectCoin, null, this);
}

function collectCoin(player, coin) {
  coin.disableBody(true, true); // Hide coin
  score += 10;
  scoreText.setText('Score: ' + score);
}
