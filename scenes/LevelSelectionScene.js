export class LevelSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectionScene' });
    }

    create() {
        // Simple title text
        this.add.text(400, 150, 'Select a Level', {
            fontSize: '48px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // --- Level 1 Button ---
        const level1Button = this.add.text(400, 280, 'Start Level 1', {
            fontSize: '32px',
            fill: '#00ff00',
            backgroundColor: '#333333',
            padding: { left: 15, right: 15, top: 10, bottom: 10 }
        }).setOrigin(0.5).setInteractive();

        level1Button.on('pointerdown', () => {
            // Reset total score when starting Level 1 (new game)
            if (window.gameData) {
                window.gameData.totalScore = 0;
                console.log('[DEBUG] Reset total score for new game');
            }
            // When clicked, start the main game scene
            this.scene.start('GameScene', { level: 1 });
        });

        level1Button.on('pointerover', () => {
            level1Button.setStyle({ fill: '#ffffff' });
        });

        level1Button.on('pointerout', () => {
            level1Button.setStyle({ fill: '#00ff00' });
        });

        // --- Level 2 Button ---
        const level2Button = this.add.text(400, 350, 'Start Level 2', {
            fontSize: '32px',
            fill: '#ff6b35',
            backgroundColor: '#333333',
            padding: { left: 15, right: 15, top: 10, bottom: 10 }
        }).setOrigin(0.5).setInteractive();

        level2Button.on('pointerdown', () => {
            // When clicked, start the main game scene with level 2 data
            this.scene.start('GameScene', { level: 2 });
        });

        level2Button.on('pointerover', () => {
            level2Button.setStyle({ fill: '#ffffff' });
        });

        level2Button.on('pointerout', () => {
            level2Button.setStyle({ fill: '#ff6b35' });
        });
    }
} 