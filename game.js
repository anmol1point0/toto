const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: { gravity: { y: 300 }, debug: true },
    },
    scene: {
      preload,
      create,
      update,
    },
    arcade: {
      gravity: { y: 300 },
      debug: true
    }    
  };
  
  const game = new Phaser.Game(config);
  
  let player;
  let cursors;
  
  function preload() {
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    
  }
  
  function create() {
    const platforms = this.physics.add.staticGroup();
  
    // Create 3 ground pieces side by side (full width)
    platforms.create(200, 568, 'ground');
    platforms.create(400, 568, 'ground');
    platforms.create(600, 568, 'ground');
  
    // Player setup
    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
  
    this.physics.add.collider(player, platforms);
  
    cursors = this.input.keyboard.createCursorKeys();
  }
  
  function update() {
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
    } else {
      player.setVelocityX(0);
    }
  
    // ✅ Most reliable check for "on ground"
    if (cursors.up.isDown && player.body.blocked.down) {
      player.setVelocityY(-330);
    }
  }
  