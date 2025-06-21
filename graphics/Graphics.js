export class Graphics {
    static createBrickTexture(scene, key, width = 64, height = 64) {
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
} 