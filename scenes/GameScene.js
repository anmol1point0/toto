import { Player } from '../entities/index.js';
import { Enemy } from '../entities/index.js';
import { ScoreDisplay, HeartDisplay, GameOverScreen } from '../ui/index.js';

const Logger = {
    info: (message, data = null) => console.log(`[GAME] ${message}`, data || ''),
    warn: (message, data = null) => console.warn(`[GAME] ${message}`, data || ''),
    error: (message, data = null) => console.error(`[GAME] ${message}`, data || ''),
};

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        this.platforms = null;
        this.movingPlatforms = null;
        this.coins = null;
        this.enemies = null;
        this.scoreDisplay = null;
        this.heartDisplay = null;
        this.gameOverScreen = null;
        this.player = null;
        this.lives = 3;
        this.worldWidth = 100000;
        this.lastSpawnX = 0;
        this.worldObjects = [];
        this.backgroundLayers = [];
        this.currentLevel = 1; // Default to level 1
        
        // Persistent score across levels
        if (!window.gameData) {
            window.gameData = { totalScore: 0 };
        }
    }

    // --- Texture Creation ---
    createBrickTexture(key, width = 64, height = 64) {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x8a3a0a);
        graphics.fillRect(0, 0, width, height);
        graphics.fillStyle(0xb24a0e);
        for (let y = 0; y < height; y += 16) {
            let offsetX = ((y / 16) % 2 === 0) ? 0 : -16;
            for (let x = offsetX; x < width; x += 32) {
                graphics.fillRect(x, y, 32 - 2, 16 - 2);
            }
        }
        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }

    createCoinTexture(key, size = 16) {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xFFD700);
        graphics.fillCircle(size / 2, size / 2, size / 2);
        graphics.fillStyle(0xFFE45E);
        graphics.fillCircle(size / 2, size / 2, size / 2.8);
        graphics.generateTexture(key, size, size);
        graphics.destroy();
    }

    createEnemyTexture(key) {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        const size = 32;
        
        // Body - bright red for visibility against dark backgrounds
        graphics.fillStyle(0xFF0000);
        graphics.fillRect(0, 0, size, size);

        // Single large "evil" eye (white part)
        graphics.fillStyle(0xFFFFFF);
        graphics.fillEllipse(size / 2, size / 2, size * 0.6, size * 0.8);

        // Pupil (black for contrast)
        graphics.fillStyle(0x000000);
        graphics.fillEllipse(size / 2, size / 2, size * 0.2, size * 0.3);

        graphics.generateTexture(key, size, size);
        graphics.destroy();
    }
    
    createFlagTexture(key) {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x808080);
        graphics.fillRect(0, 0, 10, 120);
        graphics.fillStyle(0x00ff00);
        graphics.fillRect(10, 10, 60, 40);
        graphics.generateTexture(key, 70, 120);
        graphics.destroy();
    }

    createHeartTexture(key) {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        const size = 32;
        
        // Create a simple heart shape
        graphics.fillStyle(0xFF0000);
        graphics.fillCircle(size/2, size/2, size/2);
        
        graphics.generateTexture(key, size, size);
        graphics.destroy();
    }

    // --- Background Creation ---
    createBackgroundLayers() {
        // Far background (clouds) - moves slowly
        for (let i = 0; i < 10; i++) {
            const cloud = this.add.circle(
                Math.random() * this.worldWidth, 
                100 + Math.random() * 150, 
                20 + Math.random() * 15, 
                0xFFFFFF, 
                0.3
            );
            cloud.setDepth(-3); // Furthest back
            this.backgroundLayers.push({ obj: cloud, speed: 0.1 });
        }
        
        // Far mountains (dark blue) - moves slowly
        for (let i = 0; i < 6; i++) {
            const mountainGroup = this.add.container(Math.random() * this.worldWidth, 550);
            const mountain1 = this.add.triangle(0, 0, 0, 80, 120, 0, 240, 80, 0x2F4F4F);
            const mountain2 = this.add.triangle(40, 0, 40, 60, 140, 0, 200, 60, 0x4A4A4A);
            const mountain3 = this.add.triangle(80, 0, 80, 40, 160, 0, 160, 40, 0x696969);
            mountainGroup.add([mountain1, mountain2, mountain3]);
            mountainGroup.setDepth(-2);
            this.backgroundLayers.push({ obj: mountainGroup, speed: 0.2 });
        }
        
        // Mid mountains (gray) - moves at medium speed
        for (let i = 0; i < 8; i++) {
            const mountainGroup = this.add.container(Math.random() * this.worldWidth, 520);
            const mountain1 = this.add.triangle(0, 0, 0, 100, 150, 0, 300, 100, 0x556B2F);
            const mountain2 = this.add.triangle(50, 0, 50, 80, 180, 0, 250, 80, 0x6B8E23);
            const mountain3 = this.add.triangle(100, 0, 100, 60, 200, 0, 200, 60, 0x808080);
            mountainGroup.add([mountain1, mountain2, mountain3]);
            mountainGroup.setDepth(-1);
            this.backgroundLayers.push({ obj: mountainGroup, speed: 0.4 });
        }
        
        // Near background (trees) - moves faster
        for (let i = 0; i < 30; i++) {
            const treeGroup = this.add.container(Math.random() * this.worldWidth, 580);
            const trunk = this.add.rectangle(0, 0, 15, 40, 0x8B4513);
            const leaves = this.add.circle(0, -20, 25, 0x228B22);
            treeGroup.add([trunk, leaves]);
            treeGroup.setDepth(0);
            this.backgroundLayers.push({ obj: treeGroup, speed: 0.6 });
        }
    }

    updateBackgroundLayers() {
        this.backgroundLayers.forEach(layer => {
            // This assumes the layer object can have tilePositionX, which might only work for TileSprites
            // A more robust solution would be needed for containers/shapes
            if (layer.obj.tilePositionX !== undefined) {
               layer.obj.tilePositionX = this.cameras.main.scrollX * layer.speed;
            } else {
                // For non-tile-sprite objects, we might need to adjust their x position
                // This is a simplified example.
            }
        });
    }

    // --- Lifecycle Methods ---
    preload() {
        this.createBrickTexture('bricks');
        this.createCoinTexture('coin');
        this.createEnemyTexture('enemy');
        this.createFlagTexture('flag');
        this.createHeartTexture('heart');
        this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
        this.load.spritesheet('coin', 'https://labs.phaser.io/assets/sprites/coin.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create(data = {}) {
        // Get level data passed from LevelSelectionScene
        this.currentLevel = data.level || 1;
        
        console.log('[DEBUG] GameScene created with level:', this.currentLevel);
        console.log('[DEBUG] Current total score:', window.gameData.totalScore);
        
        // Set dark theme for Level 2 (Cave of Coins)
        if (this.currentLevel === 2) {
            this.cameras.main.setBackgroundColor('#1a1a2e'); // Dark blue-gray for cave
            console.log('[DEBUG] Applied dark cave theme for Level 2');
        }
        
        this.lastSpawnX = 0;
        this.worldObjects = [];
        this.lives = 3;

        this.platforms = this.physics.add.staticGroup();
        this.movingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
        this.coins = this.physics.add.group();
        this.enemies = this.physics.add.group();
        
        this.physics.world.setBounds(0, 0, this.worldWidth, 600);

        this.scoreDisplay = new ScoreDisplay(this, 16, 16);
        // Initialize score display with persistent total score
        this.scoreDisplay.setScore(window.gameData.totalScore);
        this.heartDisplay = new HeartDisplay(this, 3);
        this.gameOverScreen = new GameOverScreen(this);

        this.player = new Player(this, 100, 450);
        this.player.body.collideWorldBounds = false;
        this.player.setDepth(10);
        
        // This initial enemy is temporary and will be quickly left behind.
        const firstEnemy = new Enemy(this, 600, 580, this.player);
        firstEnemy.setDepth(5);
        this.enemies.add(firstEnemy);
        this.worldObjects.push({obj: firstEnemy, type: 'enemy'});
        
        this.cameras.main.setBounds(0, 0, this.worldWidth, 600);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.movingPlatforms, this.stickPlayerToPlatform, null, this);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.enemies, this.movingPlatforms);
        this.physics.add.collider(this.coins, this.platforms);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);

        // Place the level end flag - position varies by level
        const flagX = this.currentLevel === 1 ? 5000 : 8000; // Level 2 is longer
        const flag = this.physics.add.staticSprite(flagX, 580, 'flag');
        flag.setOrigin(0.5, 1);
        flag.setDepth(0);
        this.physics.add.overlap(this.player, flag, this.reachLevelEnd, null, this);

        this.spawnWorldObjects();

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
                
                if (this.currentLevel === 2) {
                    // Level 2: Spawn coins higher up and more challenging
                    const coinY = camera.scrollY + Phaser.Math.Between(100, 200); // Higher up
                    const coin = this.coins.create(x, coinY, 'coin');
                    coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
                    coin.setDepth(3);
                    this.worldObjects.push({ obj: coin, type: 'coin' });
                } else {
                    // Level 1: Original falling coin behavior
                    const coin = this.coins.create(x, camera.scrollY, 'coin');
                    coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
                    coin.setDepth(3);
                    this.worldObjects.push({ obj: coin, type: 'coin' });
                }
            },
            loop: true
        });
    
        // Add a timer to spawn additional enemies every 3 seconds
        this.time.addEvent({
            delay: this.currentLevel === 2 ? 4000 : 3000, // Level 2: Less frequent spawning (increased from 2000)
            callback: () => {
                const camera = this.cameras.main;
                const spawnX = camera.scrollX + camera.width + 50;
                
                if (this.currentLevel === 2) {
                    // Level 2: Reduced enemy spawning for better balance
                    const spawnCount = Phaser.Math.Between(0, 1); // Spawn 0-1 enemies (reduced from 1-2)
                    for (let i = 0; i < spawnCount; i++) {
                        const enemyOffset = i * 100; // Space them out
                        if (Math.random() < 0.7) { // 70% chance on ground
                            const enemy = new Enemy(this, spawnX + enemyOffset, 580, this.player);
                            this.enemies.add(enemy);
                            this.worldObjects.push({ obj: enemy, type: 'enemy' });
                            console.log('[DEBUG] Level 2: Spawned ground enemy at x:', spawnX + enemyOffset);
                        } else { // 30% chance on platform
                            const platformY = 470;
                            const platform = this.add.tileSprite(spawnX + enemyOffset, platformY, 80, 20, 'bricks');
                            this.physics.add.existing(platform, true);
                            this.platforms.add(platform);
                            this.worldObjects.push({ obj: platform, type: 'platform' });
                            
                            const enemy = new Enemy(this, spawnX + enemyOffset, platformY, this.player);
                            this.enemies.add(enemy);
                            this.worldObjects.push({ obj: enemy, type: 'enemy' });
                            console.log('[DEBUG] Level 2: Spawned platform enemy at x:', spawnX + enemyOffset);
                        }
                    }
                } else {
                    // Level 1: Original enemy spawning
                    if (Math.random() < 0.6) {
                        const enemy = new Enemy(this, spawnX, 580, this.player);
                        this.enemies.add(enemy);
                        this.worldObjects.push({ obj: enemy, type: 'enemy' });
                    } else {
                        const platformY = 470;
                        const platform = this.add.tileSprite(spawnX, platformY, 80, 20, 'bricks');
                        this.physics.add.existing(platform, true);
                        this.platforms.add(platform);
                        this.worldObjects.push({ obj: platform, type: 'platform' });
                        
                        const enemy = new Enemy(this, spawnX, platformY, this.player);
                        this.enemies.add(enemy);
                        this.worldObjects.push({ obj: enemy, type: 'enemy' });
                    }
                }
            },
            loop: true
        });
        
        // Debug: F1 key to test game over screen
        this.input.keyboard.on('keydown-F1', () => {
            console.log('[DEBUG] F1 pressed - testing game over screen');
            this.physics.pause();
            const testScore = window.gameData.totalScore || 1234;
            console.log('[DEBUG] Test score:', testScore);
            this.gameOverScreen.show(testScore, () => {
                console.log('[DEBUG] Test restart callback');
                this.scene.restart();
            });
        });
    }

    update() {
        if (this.gameOverScreen && this.gameOverScreen.container.visible) {
            // Keep game over screen centered on camera
            const cam = this.cameras.main;
            this.gameOverScreen.container.setPosition(cam.scrollX + cam.width / 2, cam.scrollY + cam.height / 2);
            return; // Don't update game logic when game over screen is visible
        }

        this.spawnWorldObjects();
        this.cleanupWorldObjects();
        
        // Manual world bounds check for the player - die when falling below the game screen
        if (this.player.y > 650 && this.player.active) {
            Logger.warn('Player fell into pit!');
            this.handlePlayerDamage(this.player);
        }
        
        // Additional check: if player is below camera view, they should die
        const cameraBottom = this.cameras.main.scrollY + this.cameras.main.height;
        if (this.player.y > cameraBottom + 50 && this.player.active) {
            Logger.warn('Player fell below camera!');
            this.handlePlayerDamage(this.player);
        }
        
        // Prevent player from going too far left off-screen
        if (this.player.x < this.cameras.main.scrollX - this.player.width) {
            Logger.warn('Player went too far left off-screen');
            this.handlePlayerDamage(this.player); // Treat going too far back as falling
        }
        
        this.movingPlatforms.children.iterate(platform => {
            if (!platform.body) {
                return; // Safety check in case a platform is destroyed
            }

            if (platform.x <= platform.moveStart) {
                platform.body.setVelocityX(Math.abs(platform.body.velocity.x));
            } else if (platform.x >= platform.moveEnd) {
                platform.body.setVelocityX(-Math.abs(platform.body.velocity.x));
            }
        });

        this.worldObjects.forEach(item => {
            if (item.type === 'enemy' && item.obj.update) {
                item.obj.update(this.player);
            }
        });
        this.updateBackgroundLayers();
    }

    // --- Game Logic Methods ---
    createGroundSegment(length) {
        const ground = this.add.tileSprite(this.lastSpawnX, 580, length, 40, 'bricks');
        ground.setOrigin(0, 0); // Standardize origin
        this.physics.add.existing(ground, true);
        this.platforms.add(ground);
        ground.setDepth(1);
        this.worldObjects.push({ obj: ground, type: 'platform' });

        // --- Populate the ground segment with platforms and coins ---
        for (let x = this.lastSpawnX + 200; x < this.lastSpawnX + length - 200; x += Phaser.Math.Between(150, 250)) {
            const whatToAdd = Math.random();
            if (whatToAdd < 0.5) { // 50% chance to add a coin group
                if (this.currentLevel === 2) {
                    // Level 2: Coins in harder-to-reach places
                    const coinHeight = Phaser.Math.Between(100, 200); // Higher up
                    const coinSpacing = Phaser.Math.Between(30, 50); // More spread out
                    const numCoins = Phaser.Math.Between(3, 6); // Fewer coins but harder to get
                    
                    console.log('[DEBUG] Level 2: Creating', numCoins, 'coins at height', coinHeight);
                    
                    for (let j = 0; j < numCoins; j++) {
                        const coin = this.coins.create(x + j * coinSpacing, 540 - coinHeight, 'coin');
                        coin.setDepth(3);
                        this.worldObjects.push({ obj: coin, type: 'coin' });
                    }
                } else {
                    // Level 1: Original coin placement
                    console.log('[DEBUG] Level 1: Creating 5 coins at ground level');
                    for (let j = 0; j < 5; j++) {
                        const coin = this.coins.create(x + j * 25, 540, 'coin');
                        coin.setDepth(3);
                        this.worldObjects.push({ obj: coin, type: 'coin' });
                    }
                }
            } else if (whatToAdd < 0.8) { // 30% chance for a floating platform
                const platformY = Phaser.Math.Between(450, 520);
                const platformWidth = Phaser.Math.Between(80, 150);
                const floatingPlat = this.add.tileSprite(x, platformY, platformWidth, 20, 'bricks');
                floatingPlat.setOrigin(0, 0); // Standardize origin
                this.physics.add.existing(floatingPlat, true);
                this.platforms.add(floatingPlat);
                floatingPlat.setDepth(1);
                this.worldObjects.push({ obj: floatingPlat, type: 'platform' });
                
                // Add enemies on some platforms (25% chance)
                if (Math.random() < 0.25) {
                    const enemy = new Enemy(this, x + platformWidth/2, platformY, this.player);
                    enemy.setDepth(5);
                    this.enemies.add(enemy);
                    this.worldObjects.push({ obj: enemy, type: 'enemy' });
                }
            } else if (whatToAdd < (this.currentLevel === 2 ? 0.85 : 0.8)) { // Level 2: More frequent horizontal platforms
                const platformY = Phaser.Math.Between(400, 480);
                const platformWidth = Phaser.Math.Between(100, 180);
                const moveDistance = Phaser.Math.Between(100, 200);
                
                // Create horizontal movement platform
                const hPlatform = this.add.rectangle(x, platformY, platformWidth, 20, 0xFF6347); // Tomato Red
                hPlatform.setOrigin(0, 0); // Standardize origin
                this.movingPlatforms.add(hPlatform);
                this.physics.world.enable(hPlatform);
                hPlatform.setDepth(1);
                
                // Set movement properties - Level 2 platforms are faster
                hPlatform.moveStart = x;
                hPlatform.moveEnd = x + moveDistance;
                const platformSpeed = this.currentLevel === 2 ? 80 : 50; // Level 2: Faster platforms
                hPlatform.body.setVelocityX(platformSpeed);
                
                this.worldObjects.push({ obj: hPlatform, type: 'moving_platform' });
                
                // Add enemies on moving platforms (20% chance)
                if (Math.random() < 0.2) {
                    const enemy = new Enemy(this, x + platformWidth/2, platformY, this.player);
                    enemy.setDepth(5);
                    this.enemies.add(enemy);
                    this.worldObjects.push({ obj: enemy, type: 'enemy' });
                }
            }
        }
        
        // Add enemies on the ground (30% chance per segment)
        if (Math.random() < 0.3) {
            const enemyX = this.lastSpawnX + Phaser.Math.Between(300, length - 300);
            const enemy = new Enemy(this, enemyX, 580, this.player);
            enemy.setDepth(5);
            this.enemies.add(enemy);
            this.worldObjects.push({ obj: enemy, type: 'enemy' });
        }
        
        // Level 2: Additional corridor enemies for narrow passage feel
        if (this.currentLevel === 2) {
            // Add 0-1 extra enemies per segment (reduced from 1-2)
            const extraEnemies = Phaser.Math.Between(0, 1);
            for (let i = 0; i < extraEnemies; i++) {
                const enemyX = this.lastSpawnX + Phaser.Math.Between(200, length - 200);
                const enemyY = 580; // Ground level
                const enemy = new Enemy(this, enemyX, enemyY, this.player);
                enemy.setDepth(5);
                this.enemies.add(enemy);
                this.worldObjects.push({ obj: enemy, type: 'enemy' });
                console.log('[DEBUG] Level 2: Added corridor enemy at x:', enemyX);
            }
        }
        
        this.lastSpawnX += length;
    }

    spawnWorldObjects() {
        const spawnTriggerX = this.cameras.main.scrollX + this.cameras.main.width;

        while (this.lastSpawnX < spawnTriggerX + 400) {
            if (this.lastSpawnX === 0) {
                this.createGroundSegment(1200);
                continue;
            }

            const choice = Math.random();

            if (choice < 0.12) { // 12% chance of a pit with a moving platform
                const gapLength = Phaser.Math.Between(120, 160);
                const platformY = Phaser.Math.Between(490, 540);
                
                const ledge = this.add.tileSprite(this.lastSpawnX - 50, 580, 100, 40, 'bricks');
                ledge.setOrigin(0,0);
                this.physics.add.existing(ledge, true);
                this.platforms.add(ledge);
                this.worldObjects.push({ obj: ledge, type: 'platform' });

                const hPlatform = this.add.rectangle(this.lastSpawnX + (gapLength / 2), platformY, 150, 20, 0xFF6347); // Tomato Red
                hPlatform.setOrigin(0, 0); // Standardize origin
                this.movingPlatforms.add(hPlatform);
                this.physics.world.enable(hPlatform);

                // Set horizontal movement properties
                hPlatform.moveStart = this.lastSpawnX;
                hPlatform.moveEnd = this.lastSpawnX + gapLength - 150;
                hPlatform.body.setVelocityX(80);

                this.worldObjects.push({ obj: hPlatform, type: 'moving_platform' });

                // Add enemies on the moving platform in pits (40% chance)
                if (Math.random() < 0.4) {
                    const enemy = new Enemy(this, this.lastSpawnX + (gapLength / 2), platformY, this.player);
                    enemy.setDepth(5);
                    this.enemies.add(enemy);
                    this.worldObjects.push({ obj: enemy, type: 'enemy' });
                }

                this.lastSpawnX += gapLength;

            } else if (choice < 0.35) { // 20% chance for additional horizontal platforms
                this.createGroundSegment(Phaser.Math.Between(400, 800));
                
                // Add extra horizontal moving platforms above the ground
                const numPlatforms = Phaser.Math.Between(1, 3);
                for (let i = 0; i < numPlatforms; i++) {
                    const platformX = this.lastSpawnX - Phaser.Math.Between(200, 600);
                    const platformY = Phaser.Math.Between(350, 450);
                    const platformWidth = Phaser.Math.Between(120, 200);
                    const moveDistance = Phaser.Math.Between(150, 300);
                    
                    const extraPlatform = this.add.rectangle(platformX, platformY, platformWidth, 20, 0x1E90FF); // Vibrant Blue
                    extraPlatform.setOrigin(0, 0); // Standardize origin
                    this.movingPlatforms.add(extraPlatform);
                    this.physics.world.enable(extraPlatform);
                    extraPlatform.setDepth(1);
                    
                    // Set movement properties instead of a tween
                    extraPlatform.moveStart = platformX;
                    extraPlatform.moveEnd = platformX + moveDistance;
                    extraPlatform.body.setVelocityX(60);

                    this.worldObjects.push({ obj: extraPlatform, type: 'moving_platform' });
                    
                    // Add enemies on extra platforms (30% chance)
                    if (Math.random() < 0.3) {
                        const enemy = new Enemy(this, platformX + platformWidth/2, platformY, this.player);
                        enemy.setDepth(5);
                        this.enemies.add(enemy);
                        this.worldObjects.push({ obj: enemy, type: 'enemy' });
                    }
                }
                
            } else { // 65% chance of just more ground
                // Level 2: Sometimes create pits instead of ground
                if (this.currentLevel === 2 && Math.random() < 0.3) { // 30% chance for pits in Level 2
                    const pitLength = Phaser.Math.Between(150, 200); // Wide pits
                    console.log('[DEBUG] Level 2: Creating pit of length:', pitLength);
                    
                    // Create ledges on both sides of the pit
                    const leftLedge = this.add.tileSprite(this.lastSpawnX - 50, 580, 100, 40, 'bricks');
                    leftLedge.setOrigin(0,0);
                    this.physics.add.existing(leftLedge, true);
                    this.platforms.add(leftLedge);
                    this.worldObjects.push({ obj: leftLedge, type: 'platform' });
                    
                    const rightLedge = this.add.tileSprite(this.lastSpawnX + pitLength - 50, 580, 100, 40, 'bricks');
                    rightLedge.setOrigin(0,0);
                    this.physics.add.existing(rightLedge, true);
                    this.platforms.add(rightLedge);
                    this.worldObjects.push({ obj: rightLedge, type: 'platform' });
                    
                    this.lastSpawnX += pitLength;
                } else {
                    this.createGroundSegment(Phaser.Math.Between(500, 1200));
                }
            }
        }
    }

    cleanupWorldObjects() {
        const cleanupBuffer = 400;
        const initialCount = this.worldObjects.length;
        
        this.worldObjects = this.worldObjects.filter(item => {
            const objectRightEdge = item.obj.x + (item.obj.width || 0);

            if (objectRightEdge < this.player.x - cleanupBuffer) {
                if (item.type === 'platform') {
                    this.platforms.remove(item.obj);
                } else if (item.type === 'coin') {
                    this.coins.remove(item.obj);
                } else if (item.type === 'enemy') {
                    item.obj.destroy();
                    return false;
                } else if (item.type === 'moving_platform') {
                    this.movingPlatforms.remove(item.obj);
                }
                
                item.obj.destroy();
                return false;
            }
            return true;
        });
        
        const finalCount = this.worldObjects.length;
        const cleanedCount = initialCount - finalCount;
        if (cleanedCount > 10) {
            Logger.info(`Cleaned up ${cleanedCount} objects, ${finalCount} remaining`);
        }
    }

    stickPlayerToPlatform(player, platform) {
        if (player.body.touching.down && platform.body.touching.up) {
            player.body.velocity.x = platform.body.velocity.x;
        }
    }

    collectCoin(player, coin) {
        coin.disableBody(true, true);
        this.scoreDisplay.updateScore(10);
        
        // Update persistent total score
        window.gameData.totalScore += 10;
        console.log('[DEBUG] Coin collected! Total score now:', window.gameData.totalScore);
        
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

    handlePlayerDamage(player) {
        if (!player.active) {
            return;
        }

        this.lives--;
        this.heartDisplay.updateLives(this.lives);
        Logger.warn(`Player took damage! Lives remaining: ${this.lives}`);
        player.body.setEnable(false); // More robust than setActive

        if (this.lives > 0) {
            player.setAlpha(0.2);
            const respawnX = this.cameras.main.scrollX + 100;
            player.setPosition(respawnX, 450);
            player.setVelocity(0, 0);
            
            this.time.delayedCall(100, () => {
                player.setActive(true);
                player.body.setEnable(true);
                this.tweens.add({ targets: player, alpha: 1, duration: 1000 });
            });
            
        } else {
            Logger.error('Player has no lives left! Showing game over screen...');
            console.log('[DEBUG] Player died, attempting to show game over screen');
            console.log('[DEBUG] GameOverScreen exists:', !!this.gameOverScreen);
            console.log('[DEBUG] Current score:', this.scoreDisplay.getScore());
            console.log('[DEBUG] ScoreDisplay exists:', !!this.scoreDisplay);
            
            player.die(() => {
                console.log('[DEBUG] Player.die() callback executed');
                this.physics.pause();
                if (this.gameOverScreen) {
                    const finalScore = window.gameData.totalScore;
                    console.log('[DEBUG] Showing game over screen with total score:', finalScore);
                    console.log('[DEBUG] Score type:', typeof finalScore);
                    this.gameOverScreen.show(finalScore, () => {
                        console.log('[DEBUG] Restart callback executed');
                        this.scene.restart();
                    });
                } else {
                    Logger.error('GameOverScreen is not available!');
                }
            });
            
            // Fallback: if player.die() doesn't work, show game over screen directly
            this.time.delayedCall(1000, () => {
                console.log('[DEBUG] Fallback timer executed');
                console.log('[DEBUG] GameOverScreen container visible:', this.gameOverScreen?.container.visible);
                if (this.gameOverScreen && !this.gameOverScreen.container.visible) {
                    console.log('[DEBUG] Using fallback to show game over screen');
                    this.physics.pause();
                    const finalScore = window.gameData.totalScore;
                    console.log('[DEBUG] Fallback total score:', finalScore);
                    this.gameOverScreen.show(finalScore, () => {
                        this.scene.restart();
                    });
                }
            });
            
            // Additional fallback: force show game over screen after 2 seconds
            this.time.delayedCall(2000, () => {
                console.log('[DEBUG] Force fallback timer executed');
                if (this.gameOverScreen && !this.gameOverScreen.container.visible) {
                    console.log('[DEBUG] Force showing game over screen');
                    this.physics.pause();
                    const finalScore = window.gameData.totalScore || 0;
                    console.log('[DEBUG] Force fallback total score:', finalScore);
                    
                    // Force the container to be visible and positioned
                    this.gameOverScreen.container.setVisible(true);
                    this.gameOverScreen.container.setAlpha(1);
                    this.gameOverScreen.container.setPosition(400, 300);
                    
                    this.gameOverScreen.show(finalScore, () => {
                        this.scene.restart();
                    });
                }
            });
        }
    }

    hitEnemy(player, enemy) {
        this.handlePlayerDamage(player);
    }

    reachLevelEnd(player, flag) {
        Logger.info('Player reached level end!');
        // Stop the camera from following the player
        this.cameras.main.stopFollow();
        
        // Stop physics and player movement
        this.physics.pause();
        player.setVelocityX(0);
        player.setActive(false);

        const cam = this.cameras.main;
        
        if (this.currentLevel === 1) {
            // Level 1 completed - show completion screen and go to Level 2
            const levelCompleteText = this.add.text(
                cam.scrollX + cam.width / 2, 
                cam.scrollY + cam.height / 2 - 50, 
                'Level 1 Complete!', 
                { fontSize: '48px', fill: '#00ff00', stroke: '#000', strokeThickness: 4 }
            );
            levelCompleteText.setOrigin(0.5, 0.5);
            levelCompleteText.setDepth(100);
            
            const nextLevelText = this.add.text(
                cam.scrollX + cam.width / 2, 
                cam.scrollY + cam.height / 2 + 20, 
                'Press SPACE to continue to Level 2', 
                { fontSize: '24px', fill: '#ffffff', stroke: '#000', strokeThickness: 2 }
            );
            nextLevelText.setOrigin(0.5, 0.5);
            nextLevelText.setDepth(100);
            
            // Wait for space key to start Level 2
            this.input.keyboard.once('keydown-SPACE', () => {
                console.log('[DEBUG] Starting Level 2 from Level 1 completion');
                this.scene.start('GameScene', { level: 2 });
            });
            
        } else if (this.currentLevel === 2) {
            // Level 2 completed - show final completion
            const levelCompleteText = this.add.text(
                cam.scrollX + cam.width / 2, 
                cam.scrollY + cam.height / 2 - 50, 
                'Level 2 Complete!', 
                { fontSize: '48px', fill: '#00ff00', stroke: '#000', strokeThickness: 4 }
            );
            levelCompleteText.setOrigin(0.5, 0.5);
            levelCompleteText.setDepth(100);
            
            const finalScoreText = this.add.text(
                cam.scrollX + cam.width / 2, 
                cam.scrollY + cam.height / 2 + 20, 
                `Final Score: ${window.gameData.totalScore}`, 
                { fontSize: '32px', fill: '#ffffff', stroke: '#000', strokeThickness: 3 }
            );
            finalScoreText.setOrigin(0.5, 0.5);
            finalScoreText.setDepth(100);
            
            const restartText = this.add.text(
                cam.scrollX + cam.width / 2, 
                cam.scrollY + cam.height / 2 + 60, 
                'Press R to return to level selection', 
                { fontSize: '24px', fill: '#ffffff', stroke: '#000', strokeThickness: 2 }
            );
            restartText.setOrigin(0.5, 0.5);
            restartText.setDepth(100);
            
            // Wait for R key to return to level selection
            this.input.keyboard.once('keydown-R', () => {
                console.log('[DEBUG] Returning to level selection from Level 2 completion');
                this.scene.start('LevelSelectionScene');
            });
        }
    }
} 