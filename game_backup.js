import { Player } from './entities/index.js';
import { Enemy } from './entities/index.js';
import { ScoreDisplay, HeartDisplay, GameOverScreen } from './ui/index.js';

let platforms, movingPlatforms, coins, enemies, scoreDisplay, heartDisplay, gameOverScreen;
let player;
let lives;
let worldWidth = 100000; // Total world width - effectively "endless"
let spawnDistance = 800; // Distance ahead of player to spawn objects
let lastSpawnX = 0; // Track where we last generated a chunk
let worldObjects = []; // Track all spawned objects for cleanup
let backgroundLayers = []; // Track background elements for parallax

/**
 * Procedurally generates a repeating brick texture.
 * This avoids external asset loading issues.
 * @param {Phaser.Scene} scene The scene to create the texture in.
 * @param {string} key The key to assign to the new texture.
 * @param {number} width The width of the texture swatch.
 * @param {number} height The height of the texture swatch.
 */
function createBrickTexture(scene, key, width = 64, height = 64) {
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });

    // --- Draw the brick pattern ---
    graphics.fillStyle(0x8a3a0a); // Dark brown for mortar
    graphics.fillRect(0, 0, width, height);
    
    graphics.fillStyle(0xb24a0e); // Brick red
    let x = 0, y = 0, row = 0;
    const brickHeight = 16;
    const brickWidth = 32;

    for (y = 0; y < height; y += brickHeight) {
        let offsetX = (row % 2 === 0) ? 0 : -brickWidth / 2;
        for (x = offsetX; x < width; x += brickWidth) {
            graphics.fillRect(x, y, brickWidth - 2, brickHeight - 2);
        }
        row++;
    }
    
    // --- Generate a texture from the graphics ---
    graphics.generateTexture(key, width, height);
    graphics.destroy();
}

function createCoinTexture(scene, key, size = 16) {
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    
    // Outer circle (gold)
    graphics.fillStyle(0xFFD700);
    graphics.fillCircle(size / 2, size / 2, size / 2);

    // Inner circle (lighter gold for shine)
    graphics.fillStyle(0xFFE45E);
    graphics.fillCircle(size / 2, size / 2, size / 2.8);

    graphics.generateTexture(key, size, size);
    graphics.destroy();
}

/**
 * Procedurally generates an "evil" enemy texture.
 * @param {Phaser.Scene} scene The scene to create the texture in.
 * @param {string} key The key to assign to the new texture.
 */
function createEnemyTexture(scene, key) {
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    const size = 32;

    // Body (dark purple)
    graphics.fillStyle(0x483D8B);
    graphics.fillRect(0, 0, size, size);

    // Single large "evil" eye (white part)
    graphics.fillStyle(0xFFFFFF);
    graphics.fillEllipse(size / 2, size / 2, size * 0.6, size * 0.8);

    // Pupil (red)
    graphics.fillStyle(0xFF0000);
    graphics.fillEllipse(size / 2, size / 2, size * 0.2, size * 0.3);

    graphics.generateTexture(key, size, size);
    graphics.destroy();
}

/**
 * Procedurally generates a flag texture for the end of the level.
 * @param {Phaser.Scene} scene The scene to create the texture in.
 * @param {string} key The key to assign to the new texture.
 */
function createFlagTexture(scene, key) {
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    // Flagpole
    graphics.fillStyle(0x808080); // Grey
    graphics.fillRect(0, 0, 10, 120);
    // Flag
    graphics.fillStyle(0x00ff00); // Green
    graphics.fillRect(10, 10, 60, 40);
    
    graphics.generateTexture(key, 70, 120);
    graphics.destroy();
}

/**
 * Creates background elements for parallax scrolling effect
 */
function createBackgroundLayers(scene) {
    // Far background (clouds) - moves slowly
    for (let i = 0; i < 10; i++) {
        const cloud = scene.add.circle(
            Math.random() * worldWidth, 
            100 + Math.random() * 150, 
            20 + Math.random() * 15, 
            0xFFFFFF, 
            0.3
        );
        cloud.setDepth(-3); // Furthest back
        backgroundLayers.push({ obj: cloud, speed: 0.1 });
    }
    
    // Far mountains (dark blue) - moves slowly
    for (let i = 0; i < 6; i++) {
        const mountainGroup = scene.add.container(Math.random() * worldWidth, 550);
        
        // Create layered mountain effect
        const mountain1 = scene.add.triangle(0, 0, 0, 80, 120, 0, 240, 80, 0x2F4F4F);
        const mountain2 = scene.add.triangle(40, 0, 40, 60, 140, 0, 200, 60, 0x4A4A4A);
        const mountain3 = scene.add.triangle(80, 0, 80, 40, 160, 0, 160, 40, 0x696969);
        
        mountainGroup.add([mountain1, mountain2, mountain3]);
        mountainGroup.setDepth(-2); // Behind everything but in front of clouds
        backgroundLayers.push({ obj: mountainGroup, speed: 0.2 });
    }
    
    // Mid mountains (gray) - moves at medium speed
    for (let i = 0; i < 8; i++) {
        const mountainGroup = scene.add.container(Math.random() * worldWidth, 520);
        
        const mountain1 = scene.add.triangle(0, 0, 0, 100, 150, 0, 300, 100, 0x556B2F);
        const mountain2 = scene.add.triangle(50, 0, 50, 80, 180, 0, 250, 80, 0x6B8E23);
        const mountain3 = scene.add.triangle(100, 0, 100, 60, 200, 0, 200, 60, 0x808080);
        
        mountainGroup.add([mountain1, mountain2, mountain3]);
        mountainGroup.setDepth(-1); // Behind gameplay but in front of far mountains
        backgroundLayers.push({ obj: mountainGroup, speed: 0.4 });
    }
    
    // Near background (trees) - moves faster
    for (let i = 0; i < 15; i++) {
        const treeGroup = scene.add.container(Math.random() * worldWidth, 520);
        
        // Tree trunk
        const trunk = scene.add.rectangle(0, 0, 15, 40, 0x8B4513);
        // Tree top
        const leaves = scene.add.circle(0, -20, 25, 0x228B22);
        
        treeGroup.add([trunk, leaves]);
        treeGroup.setDepth(0); // Behind platforms but in front of mountains
        backgroundLayers.push({ obj: treeGroup, speed: 0.6 });
    }
}

/**
 * Updates background elements for parallax scrolling
 */
function updateBackgroundLayers(cameraX) {
    backgroundLayers.forEach(layer => {
        layer.obj.tilePositionX = cameraX * layer.speed;
    });
}

/**
 * Creates a segment of solid ground and populates it with items.
 * @param {Phaser.Scene} scene The scene to add to.
 * @param {number} length The length of the ground segment.
 */
function createGroundSegment(scene, length) {
    const ground = scene.add.tileSprite(lastSpawnX, 580, length, 40, 'bricks');
    ground.setOrigin(0, 0); // Standardize origin
    scene.physics.add.existing(ground, true);
    platforms.add(ground);
    ground.setDepth(1);
    worldObjects.push({ obj: ground, type: 'platform' });

    // --- Populate the ground segment with platforms and coins ---
    for (let x = lastSpawnX + 200; x < lastSpawnX + length - 200; x += Phaser.Math.Between(150, 250)) {
        const whatToAdd = Math.random();
        if (whatToAdd < 0.5) { // 50% chance to add a coin group
            for (let j = 0; j < 5; j++) {
                const coin = coins.create(x + j * 25, 540, 'coin');
                coin.setDepth(3);
                worldObjects.push({ obj: coin, type: 'coin' });
            }
        } else if (whatToAdd < 0.8) { // 30% chance for a floating platform
            const platformY = Phaser.Math.Between(450, 520);
            const platformWidth = Phaser.Math.Between(80, 150);
            const floatingPlat = scene.add.tileSprite(x, platformY, platformWidth, 20, 'bricks');
            floatingPlat.setOrigin(0, 0); // Standardize origin
            scene.physics.add.existing(floatingPlat, true);
            platforms.add(floatingPlat);
            floatingPlat.setDepth(1);
            worldObjects.push({ obj: floatingPlat, type: 'platform' });
            
            // Add enemies on some platforms (25% chance)
            if (Math.random() < 0.25) {
                const enemy = new Enemy(scene, x + platformWidth/2, platformY, player);
                enemy.setDepth(5);
                enemies.add(enemy);
                worldObjects.push({ obj: enemy, type: 'enemy' });
            }
        } else { // 20% chance for horizontal moving platforms
            const platformY = Phaser.Math.Between(400, 480);
            const platformWidth = Phaser.Math.Between(100, 180);
            const moveDistance = Phaser.Math.Between(100, 200);
            
            // Create horizontal movement tween
            const hPlatform = scene.add.rectangle(x, platformY, platformWidth, 20, 0x1E90FF); // Vibrant Blue
            hPlatform.setOrigin(0, 0); // Standardize origin
            movingPlatforms.add(hPlatform);
            scene.physics.world.enable(hPlatform);
            hPlatform.setDepth(1);
            
            // Set movement properties instead of a tween
            hPlatform.moveStart = x;
            hPlatform.moveEnd = x + moveDistance;
            hPlatform.body.setVelocityX(50);
            
            worldObjects.push({ obj: hPlatform, type: 'moving_platform' });
            
            // Add enemies on moving platforms (20% chance)
            if (Math.random() < 0.2) {
                const enemy = new Enemy(scene, x + platformWidth/2, platformY, player);
                enemy.setDepth(5);
                enemies.add(enemy);
                worldObjects.push({ obj: enemy, type: 'enemy' });
            }
        }
    }
    
    // Add enemies on the ground (30% chance per segment)
    if (Math.random() < 0.3) {
        const enemyX = lastSpawnX + Phaser.Math.Between(300, length - 300);
        const enemy = new Enemy(scene, enemyX, 580, player);
        enemy.setDepth(5);
        enemies.add(enemy);
        worldObjects.push({ obj: enemy, type: 'enemy' });
    }
    
    lastSpawnX += length;
}

/**
 * Spawns world chunks, with a low chance of pits.
 */
function spawnWorldObjects(scene, playerX) {
    const spawnTriggerX = scene.cameras.main.scrollX + scene.cameras.main.width;

    while (lastSpawnX < spawnTriggerX + 400) {
        if (lastSpawnX === 0) {
            createGroundSegment(scene, 1200);
            continue;
        }

        const choice = Math.random();

        if (choice < 0.12) { // 12% chance of a pit with a moving platform
            const gapLength = Phaser.Math.Between(120, 160);
            const platformY = Phaser.Math.Between(490, 540);
            
            const ledge = scene.add.tileSprite(lastSpawnX - 50, 580, 100, 40, 'bricks');
            ledge.setOrigin(0,0);
            scene.physics.add.existing(ledge, true);
            platforms.add(ledge);
            worldObjects.push({ obj: ledge, type: 'platform' });

            const hPlatform = scene.add.rectangle(lastSpawnX + (gapLength / 2), platformY, 150, 20, 0xff00ff);
            hPlatform.setOrigin(0, 0); // Standardize origin
            movingPlatforms.add(hPlatform);
            scene.physics.world.enable(hPlatform);

            // Set movement properties instead of a tween
            hPlatform.moveStart = lastSpawnX;
            hPlatform.moveEnd = lastSpawnX + gapLength - 150;
            hPlatform.body.setVelocityX(80);

            worldObjects.push({ obj: hPlatform, type: 'moving_platform' });

            // Add enemies on the moving platform in pits (40% chance)
            if (Math.random() < 0.4) {
                const enemy = new Enemy(scene, lastSpawnX + (gapLength / 2), platformY, player);
                enemy.setDepth(5);
                enemies.add(enemy);
                worldObjects.push({ obj: enemy, type: 'enemy' });
            }

            lastSpawnX += gapLength;

        } else if (choice < 0.35) { // 20% chance for additional horizontal platforms
            createGroundSegment(scene, Phaser.Math.Between(400, 800));
            
            // Add extra horizontal moving platforms above the ground
            const numPlatforms = Phaser.Math.Between(1, 3);
            for (let i = 0; i < numPlatforms; i++) {
                const platformX = lastSpawnX - Phaser.Math.Between(200, 600);
                const platformY = Phaser.Math.Between(350, 450);
                const platformWidth = Phaser.Math.Between(120, 200);
                const moveDistance = Phaser.Math.Between(150, 300);
                
                const extraPlatform = scene.add.rectangle(platformX, platformY, platformWidth, 20, 0x1E90FF); // Vibrant Blue
                extraPlatform.setOrigin(0, 0); // Standardize origin
                movingPlatforms.add(extraPlatform);
                scene.physics.world.enable(extraPlatform);
                extraPlatform.setDepth(1);
                
                // Set movement properties instead of a tween
                extraPlatform.moveStart = platformX;
                extraPlatform.moveEnd = platformX + moveDistance;
                extraPlatform.body.setVelocityX(60);

                worldObjects.push({ obj: extraPlatform, type: 'moving_platform' });
                
                // Add enemies on extra platforms (30% chance)
                if (Math.random() < 0.3) {
                    const enemy = new Enemy(scene, platformX + platformWidth/2, platformY, player);
                    enemy.setDepth(5);
                    enemies.add(enemy);
                    worldObjects.push({ obj: enemy, type: 'enemy' });
                }
            }
            
        } else { // 65% chance of just more ground
            createGroundSegment(scene, Phaser.Math.Between(500, 1200));
        }
    }
}

/**
 * Cleans up objects that are far behind the player
 */
function cleanupWorldObjects(playerX) {
    const cleanupBuffer = 400; 
    
    worldObjects = worldObjects.filter(item => {
        const objectRightEdge = item.obj.x + (item.obj.width || 0);

        if (objectRightEdge < playerX - cleanupBuffer) {
            if (item.type === 'platform') {
                platforms.remove(item.obj);
            } else if (item.type === 'coin') {
                coins.remove(item.obj);
            } else if (item.type === 'enemy') {
                item.obj.destroy();
                return false;
            } else if (item.type === 'moving_platform') {
                movingPlatforms.remove(item.obj);
            }
            
            item.obj.destroy();
            return false;
        }
        return true;
    });
}

function preload() {
    // Generate procedural textures
    createBrickTexture(this, 'bricks');
    createCoinTexture(this, 'coin');
    createEnemyTexture(this, 'enemy');
    createFlagTexture(this, 'flag');

    // Load other assets (currently broken, but left for future restoration)
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/baddie.png');
    this.load.image('heart', 'https://raw.githubusercontent.com/phaserjs/examples/master/public/assets/sprites/heart.png');
    this.load.spritesheet('coin', 'https://labs.phaser.io/assets/sprites/coin.png', {
        frameWidth: 32,
        frameHeight: 32
    });
}

function create() {
    // --- Reset world state for restarts ---
    lastSpawnX = 0;
    worldObjects = [];

    lives = 3;

    platforms = this.physics.add.staticGroup();
    movingPlatforms = this.physics.add.group({
        allowGravity: false,
        immovable: true,
    });
    coins = this.physics.add.group();
    enemies = this.physics.add.group();
    
    // Set the physics world bounds to be "endless"
    this.physics.world.setBounds(0, 0, worldWidth, 600);

    // --- UI Elements (fixed to camera) ---
    scoreDisplay = new ScoreDisplay(this, 20, 20);
    heartDisplay = new HeartDisplay(this, 3);
    gameOverScreen = new GameOverScreen(this);

    player = new Player(this, 100, 450);
    player.body.collideWorldBounds = false; // Force the physics body to not collide with world bounds
    player.setDepth(10); 
    
    // This initial enemy is temporary and will be quickly left behind.
    const firstEnemy = new Enemy(this, 600, 580, player);
    firstEnemy.setDepth(5);
    enemies.add(firstEnemy);
    worldObjects.push({obj: firstEnemy, type: 'enemy'});

    // Place the level end flag
    const flag = this.physics.add.staticSprite(5000, 580, 'flag');
    flag.setOrigin(0.5, 1);
    flag.setDepth(0);

    // Set up camera to follow player horizontally
    this.cameras.main.setBounds(0, 0, worldWidth, 600);
    this.cameras.main.startFollow(player, true, 0.05, 0.05); 
    
    // Create the initial chunks of the world
    spawnWorldObjects(this, 0);

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, movingPlatforms, stickPlayerToPlatform, null, this);
    this.physics.add.collider(enemies, platforms);
    this.physics.add.collider(enemies, movingPlatforms);
    this.physics.add.collider(coins, platforms);
    this.physics.add.collider(player, enemies, hitEnemy, null, this);
    this.physics.add.overlap(player, coins, collectCoin, null, this);
    this.physics.add.overlap(player, flag, reachLevelEnd, null, this);
    
    // Create simple background music using built-in audio generation
    // createBackgroundMusic(this);

    this.anims.create({
        key: 'spin',
        frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    // Add a timer to spawn falling coins every 1.5 seconds
    this.time.addEvent({
        delay: 1500,
        callback: () => {
            const camera = this.cameras.main;
            const x = Phaser.Math.Between(camera.scrollX, camera.scrollX + camera.width);
            const coin = coins.create(x, camera.scrollY, 'coin');
            coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
            coin.setDepth(3);
            worldObjects.push({ obj: coin, type: 'coin' });
        },
        loop: true
    });

    // Add a timer to spawn additional enemies every 3 seconds
    this.time.addEvent({
        delay: 3000,
        callback: () => {
            const camera = this.cameras.main;
            const spawnX = camera.scrollX + camera.width + 50;
            
            // 60% chance to spawn on ground, 40% chance on a floating platform
            if (Math.random() < 0.6) {
                const enemy = new Enemy(this, spawnX, 580, player);
                enemy.setDepth(5);
                enemies.add(enemy);
                worldObjects.push({ obj: enemy, type: 'enemy' });
            } else {
                // Create a small platform for the enemy
                const platformY = 470;
                const platform = this.add.tileSprite(spawnX, platformY, 80, 20, 'bricks');
                platform.setOrigin(0, 0); // Standardize origin
                this.physics.add.existing(platform, true);
                platforms.add(platform);
                platform.setDepth(1);
                worldObjects.push({ obj: platform, type: 'platform' });
                
                const enemy = new Enemy(this, spawnX, platformY, player);
                enemy.setDepth(5);
                enemies.add(enemy);
                worldObjects.push({ obj: enemy, type: 'enemy' });
            }
        },
        loop: true
    });
}

/**
 * Creates a simple background music using built-in audio generation
 */
/*
function createBackgroundMusic(scene) {
    // Create a simple melody pattern
    const melody = [
        { note: 'C4', duration: 500 },
        { note: 'E4', duration: 500 },
        { note: 'G4', duration: 500 },
        { note: 'C5', duration: 500 },
        { note: 'G4', duration: 500 },
        { note: 'E4', duration: 500 },
        { note: 'C4', duration: 1000 }
    ];
    
    let currentNote = 0;
    
    // Play the melody in a loop
    const playMelody = () => {
        if (scene.sound && scene.sound.context) {
            const note = melody[currentNote];
            const frequency = getNoteFrequency(note.note);
            
            // Create a simple sine wave tone
            const oscillator = scene.sound.context.createOscillator();
            const gainNode = scene.sound.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(scene.sound.context.destination);
            
            oscillator.frequency.setValueAtTime(frequency, scene.sound.context.currentTime);
            oscillator.type = 'sine';
            
            // Fade in and out for smooth sound
            gainNode.gain.setValueAtTime(0, scene.sound.context.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, scene.sound.context.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, scene.sound.context.currentTime + note.duration / 1000);
            
            oscillator.start(scene.sound.context.currentTime);
            oscillator.stop(scene.sound.context.currentTime + note.duration / 1000);
            
            currentNote = (currentNote + 1) % melody.length;
            
            // Schedule next note
            scene.time.delayedCall(note.duration, playMelody);
        }
    };
    
    // Start the melody after a short delay
    scene.time.delayedCall(1000, playMelody);
}

/**
 * Converts musical note to frequency
 */
function getNoteFrequency(note) {
    const notes = {
        'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
        'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25
    };
    return notes[note] || 440;
}
*/

function reachLevelEnd(player, flag) {
    // Stop the camera from following the player
    this.cameras.main.stopFollow();
    
    // Stop physics and player movement
    this.physics.pause();
    player.setVelocityX(0);
    player.setActive(false);

    const cam = this.cameras.main;
    const levelCompleteText = this.add.text(
        cam.scrollX + cam.width / 2, 
        cam.scrollY + cam.height / 2, 
        'Level Complete!', 
        { fontSize: '48px', fill: '#00ff00', stroke: '#000', strokeThickness: 4 }
    );
    levelCompleteText.setOrigin(0.5, 0.5);
    levelCompleteText.setDepth(100);
}

function stickPlayerToPlatform(player, platform) {
    // Make player "stick" to horizontal moving platforms
    if (player.body.touching.down && platform.body.touching.up) {
        player.body.velocity.x = platform.body.velocity.x;
    }
}

function collectCoin(player, coin) {
    coin.disableBody(true, true);
    scoreDisplay.updateScore(10);
    
    // Add visual feedback for coin collection
    const coinText = this.add.text(coin.x, coin.y - 20, '+10', {
        fontSize: '16px',
        fill: '#FFD700',
        stroke: '#000',
        strokeThickness: 2
    });
    coinText.setDepth(15); // Score text should be in front of everything
    
    // Animate the score text
    this.tweens.add({
        targets: coinText,
        y: coinText.y - 30,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => coinText.destroy()
    });
}

function handlePlayerDamage(scene, player) {
    if (!player.active) return;

    lives--;
    heartDisplay.updateLives(lives);
    console.log('Player took damage! Lives remaining:', lives);
    player.body.setEnable(false); // More robust than setActive

    if (lives > 0) {
        player.setAlpha(0.2);
        const respawnX = scene.cameras.main.scrollX + 100;
        player.setPosition(respawnX, 450);
        player.setVelocity(0, 0);
        
        scene.time.delayedCall(100, () => {
            player.setActive(true);
            player.body.setEnable(true);
            scene.tweens.add({ targets: player, alpha: 1, duration: 1000 });
        });
        
    } else {
        console.log('Player has no lives left! Showing game over screen...');
        player.die(() => {
            console.log('Player die animation completed, showing game over screen');
            scene.physics.pause();
            if (gameOverScreen) {
                gameOverScreen.show(scoreDisplay.getScore(), () => {
                    scene.scene.restart();
                });
            } else {
                console.error('GameOverScreen is not available!');
            }
        });
        
        // Fallback: if player.die() doesn't work, show game over screen directly
        scene.time.delayedCall(1000, () => {
            if (gameOverScreen && !gameOverScreen.visible) {
                console.log('Fallback: showing game over screen directly');
                scene.physics.pause();
                gameOverScreen.show(scoreDisplay.getScore(), () => {
                    scene.scene.restart();
                });
            }
        });
    }
}

function hitEnemy(player, enemy) {
  if (!player.active) return;
  handlePlayerDamage(this, player);
}

function update() {
    if (gameOverScreen && gameOverScreen.visible) {
        return;
    }

    spawnWorldObjects(this, player.x);
    cleanupWorldObjects(player.x);
    
    // Manual world bounds check for the player - die when falling below the game screen
    if (player.y > 650 && player.active) {
        console.log('Player fell into pit! Y position:', player.y);
        handlePlayerDamage(this, player);
    }
    
    // Additional check: if player is below camera view, they should die
    const cameraBottom = this.cameras.main.scrollY + this.cameras.main.height;
    if (player.y > cameraBottom + 50 && player.active) {
        console.log('Player fell below camera! Y position:', player.y, 'Camera bottom:', cameraBottom);
        handlePlayerDamage(this, player);
    }
    
    // Prevent player from going too far left off-screen
    if (player.x < this.cameras.main.scrollX - player.width) {
        handlePlayerDamage(this, player); // Treat going too far back as falling
    }

    // Update moving platform directions
    movingPlatforms.children.iterate(platform => {
        if (!platform.body) return; // Safety check in case a platform is destroyed

        if (platform.x <= platform.moveStart) {
            platform.body.setVelocityX(Math.abs(platform.body.velocity.x));
        } else if (platform.x >= platform.moveEnd) {
            platform.body.setVelocityX(-Math.abs(platform.body.velocity.x));
        }
    });

    // player.update(); // This is handled by preUpdate in the Player class now

    // Update enemies and background
    worldObjects.forEach(item => {
        if (item.type === 'enemy') {
            item.obj.update(player);
        }
    });
    updateBackgroundLayers(this.cameras.main.scrollX);
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#D3D3D3', // Light Gray for night-time playability
  physics: { default: 'arcade', arcade: { gravity: { y: 500 } } },
  scene: { preload, create, update }
};

new Phaser.Game(config);
