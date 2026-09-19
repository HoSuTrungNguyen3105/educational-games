import Phaser from 'phaser';
import { gridToScreen, calculateDepth, TILE_WIDTH, TILE_HEIGHT } from './utils/isometric.js';

export default class FarmScene extends Phaser.Scene {
    constructor() {
        super('FarmScene');
        this.plants = {}; 
        this.player = null;
        this.playerTarget = null;
        this.playerSpeed = 150; // pixels per second
    }

    preload() {}

    create() {
        this.cameras.main.setBackgroundColor('#87CEEB'); 
        this.cameras.main.setScroll(-this.sys.game.scale.width / 2, -100);
        
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            let newZoom = this.cameras.main.zoom - deltaY * 0.001;
            this.cameras.main.zoom = Phaser.Math.Clamp(newZoom, 0.5, 2);
        });

        this.input.on('pointermove', (pointer) => {
            if (!pointer.isDown) return;
            this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom;
            this.cameras.main.scrollY -= (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom;
        });

        this.scale.on('resize', (gameSize) => {
            this.cameras.main.setSize(gameSize.width, gameSize.height);
        });

        this.drawGround();
        this.drawWater();
        this.drawPath();

        this.drawHouse(0, -3);
        this.drawBarn(4, -3);
        this.drawShop(6, 4);

        this.drawFarmPlot(-3, 2, 4, 3);
        
        this.drawTree(-5, -2, 'pine');
        this.drawTree(-6, 0, 'pine');
        this.drawTree(-4, -4, 'round');
        this.drawTree(5, -6, 'round');
        this.drawTree(7, -5, 'pine');
        this.drawTree(-6, 5, 'round');
        this.drawTree(8, 2, 'pine');
        
        this.drawFence(-2, -1, 5, 'x');

        this.drawCow(2, -1);
        this.drawChicken(-2, 5);
        this.drawChicken(-1, 6);

        // Player Setup
        this.player = this.createPlayer(0, 0);
        this.playerTarget = { x: this.player.x, y: this.player.y };
        
        // Setup Ground Click to Move
        this.input.on('pointerup', (pointer, currentlyOver) => {
            // Check if it's a tap/click and not a drag
            const distance = Phaser.Math.Distance.Between(pointer.downX, pointer.downY, pointer.upX, pointer.upY);
            if (pointer.getDuration() < 300 && distance < 5) {
                // If we clicked on something interactive (like a farm cell), don't move there
                if (currentlyOver.length > 0) return; 

                // Move player to clicked world coordinate
                this.playerTarget = { x: pointer.worldX, y: pointer.worldY };
            }
        });
    }

    update(time, delta) {
        // Move player towards target
        if (this.player && this.playerTarget) {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.playerTarget.x, this.playerTarget.y);
            if (dist > 2) {
                // Calculate step
                const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.playerTarget.x, this.playerTarget.y);
                const step = (this.playerSpeed * delta) / 1000;
                
                this.player.x += Math.cos(angle) * step;
                this.player.y += Math.sin(angle) * step;
                
                // Update depth dynamically as character moves
                this.player.setDepth(calculateDepth(this.player.y) + 1);

                // Simple bobbing animation when walking
                this.player.list[0].y = Math.sin(time * 0.015) * 3;
            } else {
                // Stop bobbing
                this.player.list[0].y = 0;
            }
        }
    }

    // ==========================================
    // DRAWING METHODS (USING PHASER GRAPHICS)
    // ==========================================

    drawGround() {
        const graphics = this.add.graphics();
        const center = gridToScreen(0, 0);
        const radius = 12;
        
        graphics.fillStyle(0x72d148, 1);
        graphics.beginPath();
        
        const p1 = gridToScreen(0, -radius);
        const p2 = gridToScreen(radius, 0);
        const p3 = gridToScreen(0, radius);
        const p4 = gridToScreen(-radius, 0);
        
        graphics.moveTo(p1.x, p1.y);
        graphics.lineTo(p2.x, p2.y);
        graphics.lineTo(p3.x, p3.y);
        graphics.lineTo(p4.x, p4.y);
        graphics.closePath();
        graphics.fillPath();

        graphics.fillStyle(0x5cb83a, 1);
        graphics.beginPath();
        graphics.moveTo(p2.x, p2.y);
        graphics.lineTo(p3.x, p3.y);
        graphics.lineTo(p4.x, p4.y);
        graphics.lineTo(p4.x, p4.y + 20);
        graphics.lineTo(p3.x, p3.y + 20);
        graphics.lineTo(p2.x, p2.y + 20);
        graphics.closePath();
        graphics.fillPath();
        
        graphics.setDepth(-1000); 
    }

    drawWater() {
        const graphics = this.add.graphics();
        const pos = gridToScreen(-5, 6);
        
        graphics.fillStyle(0x3fc8f0, 1);
        graphics.beginPath();
        graphics.moveTo(pos.x, pos.y - 20);
        graphics.lineTo(pos.x + 60, pos.y);
        graphics.lineTo(pos.x, pos.y + 40);
        graphics.lineTo(pos.x - 60, pos.y);
        graphics.closePath();
        graphics.fillPath();
        
        graphics.lineStyle(4, 0x8a7050);
        graphics.strokePath();

        graphics.setDepth(calculateDepth(pos.y - 10)); 
    }

    drawPath() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0xd4b483, 1);
        
        const start = gridToScreen(0, -1);
        const end = gridToScreen(0, 4);
        
        graphics.beginPath();
        graphics.moveTo(start.x - 20, start.y);
        graphics.lineTo(end.x - 20, end.y);
        graphics.lineTo(end.x + 20, end.y);
        graphics.lineTo(start.x + 20, start.y);
        graphics.closePath();
        graphics.fillPath();
        
        graphics.setDepth(-990); 
    }

    drawHouse(gridX, gridY) {
        const pos = gridToScreen(gridX, gridY);
        const depth = calculateDepth(pos.y);
        const graphics = this.add.graphics();
        graphics.setDepth(depth);

        graphics.fillStyle(0xf0dfc0, 1);
        graphics.beginPath();
        graphics.moveTo(pos.x, pos.y); 
        graphics.lineTo(pos.x - 60, pos.y - 30); 
        graphics.lineTo(pos.x - 60, pos.y - 90); 
        graphics.lineTo(pos.x, pos.y - 60); 
        graphics.closePath();
        graphics.fillPath();
        
        graphics.fillStyle(0xdcc8a0, 1);
        graphics.beginPath();
        graphics.moveTo(pos.x, pos.y); 
        graphics.lineTo(pos.x + 80, pos.y - 40); 
        graphics.lineTo(pos.x + 80, pos.y - 100); 
        graphics.lineTo(pos.x, pos.y - 60); 
        graphics.closePath();
        graphics.fillPath();

        graphics.fillStyle(0xb03328, 1);
        graphics.beginPath();
        graphics.moveTo(pos.x - 70, pos.y - 85);
        graphics.lineTo(pos.x, pos.y - 50);
        graphics.lineTo(pos.x + 10, pos.y - 130);
        graphics.lineTo(pos.x - 60, pos.y - 160);
        graphics.closePath();
        graphics.fillPath();
        
        graphics.fillStyle(0x962a22, 1);
        graphics.beginPath();
        graphics.moveTo(pos.x - 70, pos.y - 85); 
        graphics.lineTo(pos.x, pos.y - 50);      
        graphics.lineTo(pos.x + 90, pos.y - 95); 
        graphics.lineTo(pos.x + 20, pos.y - 130); 
        graphics.closePath();
        graphics.fillPath();

        graphics.fillStyle(0x5c3a1e, 1);
        graphics.fillRect(pos.x - 30, pos.y - 45, 20, 35);
    }

    drawBarn(gridX, gridY) {
        const pos = gridToScreen(gridX, gridY);
        const depth = calculateDepth(pos.y);
        const graphics = this.add.graphics();
        graphics.setDepth(depth);

        graphics.fillStyle(0xcc3333, 1);
        graphics.beginPath();
        graphics.moveTo(pos.x, pos.y); 
        graphics.lineTo(pos.x - 50, pos.y - 25); 
        graphics.lineTo(pos.x - 50, pos.y - 80); 
        graphics.lineTo(pos.x, pos.y - 55); 
        graphics.closePath();
        graphics.fillPath();

        graphics.fillStyle(0x992222, 1);
        graphics.beginPath();
        graphics.moveTo(pos.x, pos.y); 
        graphics.lineTo(pos.x + 60, pos.y - 30); 
        graphics.lineTo(pos.x + 60, pos.y - 85); 
        graphics.lineTo(pos.x, pos.y - 55); 
        graphics.closePath();
        graphics.fillPath();

        graphics.fillStyle(0x555555, 1);
        graphics.beginPath();
        graphics.moveTo(pos.x - 60, pos.y - 75);
        graphics.lineTo(pos.x, pos.y - 45);
        graphics.lineTo(pos.x + 70, pos.y - 80);
        graphics.lineTo(pos.x + 10, pos.y - 110);
        graphics.closePath();
        graphics.fillPath();
    }

    drawShop(gridX, gridY) {
        const pos = gridToScreen(gridX, gridY);
        const depth = calculateDepth(pos.y);
        const graphics = this.add.graphics();
        graphics.setDepth(depth);

        graphics.fillStyle(0xf0d8a0, 1);
        graphics.beginPath();
        graphics.moveTo(pos.x, pos.y); 
        graphics.lineTo(pos.x - 40, pos.y - 20); 
        graphics.lineTo(pos.x - 40, pos.y - 60); 
        graphics.lineTo(pos.x, pos.y - 40); 
        graphics.closePath();
        graphics.fillPath();

        graphics.fillStyle(0xd0b880, 1);
        graphics.beginPath();
        graphics.moveTo(pos.x, pos.y); 
        graphics.lineTo(pos.x + 50, pos.y - 25); 
        graphics.lineTo(pos.x + 50, pos.y - 65); 
        graphics.lineTo(pos.x, pos.y - 40); 
        graphics.closePath();
        graphics.fillPath();

        graphics.fillStyle(0xe83540, 1);
        graphics.beginPath();
        graphics.moveTo(pos.x - 50, pos.y - 40);
        graphics.lineTo(pos.x + 10, pos.y - 10);
        graphics.lineTo(pos.x + 60, pos.y - 35);
        graphics.lineTo(pos.x, pos.y - 65);
        graphics.closePath();
        graphics.fillPath();
        
        graphics.fillStyle(0x8a5a28, 1);
        graphics.beginPath();
        graphics.moveTo(pos.x + 5, pos.y - 10);
        graphics.lineTo(pos.x + 40, pos.y - 28);
        graphics.lineTo(pos.x + 40, pos.y - 18);
        graphics.lineTo(pos.x + 5, pos.y);
        graphics.closePath();
        graphics.fillPath();
    }

    drawTree(gridX, gridY, type = 'round') {
        const pos = gridToScreen(gridX, gridY);
        const depth = calculateDepth(pos.y);
        const graphics = this.add.graphics();
        graphics.setDepth(depth);

        graphics.fillStyle(0x8a6230, 1);
        graphics.fillRect(pos.x - 4, pos.y - 20, 8, 20);

        if (type === 'pine') {
            graphics.fillStyle(0x3a8a20, 1);
            graphics.beginPath(); graphics.moveTo(pos.x - 20, pos.y - 15); graphics.lineTo(pos.x + 20, pos.y - 15); graphics.lineTo(pos.x, pos.y - 45); graphics.fillPath();
            graphics.fillStyle(0x4aa830, 1);
            graphics.beginPath(); graphics.moveTo(pos.x - 15, pos.y - 30); graphics.lineTo(pos.x + 15, pos.y - 30); graphics.lineTo(pos.x, pos.y - 60); graphics.fillPath();
            graphics.fillStyle(0x5cb83a, 1);
            graphics.beginPath(); graphics.moveTo(pos.x - 10, pos.y - 45); graphics.lineTo(pos.x + 10, pos.y - 45); graphics.lineTo(pos.x, pos.y - 75); graphics.fillPath();
        } else {
            graphics.fillStyle(0x3a8a20, 1);
            graphics.fillCircle(pos.x - 15, pos.y - 30, 15);
            graphics.fillCircle(pos.x + 15, pos.y - 30, 15);
            graphics.fillStyle(0x4aa830, 1);
            graphics.fillCircle(pos.x, pos.y - 45, 20);
        }
    }

    drawFence(gridX, gridY, length, dir) {
        const pos = gridToScreen(gridX, gridY);
        const graphics = this.add.graphics();
        graphics.setDepth(calculateDepth(pos.y));
        
        graphics.lineStyle(2, 0x8a6a3f);
        if (dir === 'x') {
            const end = gridToScreen(gridX + length, gridY);
            graphics.strokeLineShape(new Phaser.Geom.Line(pos.x, pos.y - 10, end.x, end.y - 10));
            graphics.strokeLineShape(new Phaser.Geom.Line(pos.x, pos.y - 5, end.x, end.y - 5));
            for(let i=0; i<=length; i++) {
                const p = gridToScreen(gridX + i, gridY);
                graphics.fillStyle(0x7a5a32, 1);
                graphics.fillRect(p.x - 2, p.y - 15, 4, 15);
            }
        }
    }

    drawFarmPlot(startX, startY, cols, rows) {
        for(let r=0; r<rows; r++) {
            for(let c=0; c<cols; c++) {
                const pos = gridToScreen(startX + c, startY + r);
                
                const cellGraphics = this.add.graphics();
                cellGraphics.setDepth(-980);
                
                cellGraphics.fillStyle(0x5a3e20, 1);
                cellGraphics.beginPath();
                cellGraphics.moveTo(pos.x, pos.y - TILE_HEIGHT/2 + 2);
                cellGraphics.lineTo(pos.x + TILE_WIDTH/2 - 2, pos.y);
                cellGraphics.lineTo(pos.x, pos.y + TILE_HEIGHT/2 - 2);
                cellGraphics.lineTo(pos.x - TILE_WIDTH/2 + 2, pos.y);
                cellGraphics.closePath();
                cellGraphics.fillPath();

                cellGraphics.fillStyle(0x6a4a2a, 1);
                cellGraphics.beginPath();
                cellGraphics.moveTo(pos.x, pos.y - TILE_HEIGHT/2 + 6);
                cellGraphics.lineTo(pos.x + TILE_WIDTH/2 - 8, pos.y);
                cellGraphics.lineTo(pos.x, pos.y + TILE_HEIGHT/2 - 6);
                cellGraphics.lineTo(pos.x - TILE_WIDTH/2 + 8, pos.y);
                cellGraphics.closePath();
                cellGraphics.fillPath();

                const hitbox = new Phaser.Geom.Polygon([
                    new Phaser.Geom.Point(pos.x, pos.y - TILE_HEIGHT/2 + 2),
                    new Phaser.Geom.Point(pos.x + TILE_WIDTH/2 - 2, pos.y),
                    new Phaser.Geom.Point(pos.x, pos.y + TILE_HEIGHT/2 - 2),
                    new Phaser.Geom.Point(pos.x - TILE_WIDTH/2 + 2, pos.y)
                ]);

                const zone = this.add.zone(0, 0, 800, 600) 
                    .setOrigin(0)
                    .setInteractive(hitbox, Phaser.Geom.Polygon.Contains);

                zone.on('pointerdown', (pointer) => {
                    this.input.once('pointerup', (upPointer) => {
                        const distance = Phaser.Math.Distance.Between(pointer.downX, pointer.downY, upPointer.x, upPointer.y);
                        if (distance < 5) {
                            window.dispatchEvent(new CustomEvent('farmCellClick', { detail: { row: r, col: c }}));
                            this.drawCrop(startX + c, startY + r, 'sprout');
                        }
                    });
                });
                
                zone.on('pointerover', () => { cellGraphics.setAlpha(0.8); });
                zone.on('pointerout', () => { cellGraphics.setAlpha(1); });
            }
        }
    }

    drawCrop(gridX, gridY, stage) {
        const pos = gridToScreen(gridX, gridY);
        const depth = calculateDepth(pos.y);
        const graphics = this.add.graphics();
        graphics.setDepth(depth);

        if (stage === 'sprout') {
            graphics.fillStyle(0x6aaa30, 1);
            graphics.fillRect(pos.x - 2, pos.y - 10, 4, 10);
            graphics.fillCircle(pos.x - 4, pos.y - 10, 4);
            graphics.fillCircle(pos.x + 4, pos.y - 10, 4);
        }
    }

    drawCow(gridX, gridY) {
        const pos = gridToScreen(gridX, gridY);
        const depth = calculateDepth(pos.y);
        const graphics = this.add.graphics();
        graphics.setDepth(depth);

        graphics.fillStyle(0xffffff, 1);
        graphics.fillRoundedRect(pos.x - 15, pos.y - 25, 30, 20, 4);
        graphics.fillStyle(0x222222, 1); 
        graphics.fillCircle(pos.x - 5, pos.y - 20, 4);
        graphics.fillCircle(pos.x + 8, pos.y - 15, 5);

        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(pos.x + 10, pos.y - 30, 15, 15);
        graphics.fillStyle(0xffaabb, 1); 
        graphics.fillRect(pos.x + 18, pos.y - 22, 8, 8);

        graphics.fillStyle(0x333333, 1);
        graphics.fillRect(pos.x - 12, pos.y - 5, 4, 5);
        graphics.fillRect(pos.x - 4, pos.y - 5, 4, 5);
        graphics.fillRect(pos.x + 10, pos.y - 5, 4, 5);
        graphics.fillRect(pos.x + 18, pos.y - 5, 4, 5);
    }

    drawChicken(gridX, gridY) {
        const pos = gridToScreen(gridX, gridY);
        const depth = calculateDepth(pos.y);
        const graphics = this.add.graphics();
        graphics.setDepth(depth);

        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(pos.x, pos.y - 10, 8);
        
        graphics.fillStyle(0xff0000, 1);
        graphics.fillCircle(pos.x + 2, pos.y - 18, 3);
        
        graphics.fillStyle(0xffcc00, 1);
        graphics.beginPath();
        graphics.moveTo(pos.x + 6, pos.y - 12);
        graphics.lineTo(pos.x + 12, pos.y - 10);
        graphics.lineTo(pos.x + 6, pos.y - 8);
        graphics.fillPath();

        graphics.fillStyle(0xffcc00, 1);
        graphics.fillRect(pos.x - 2, pos.y - 3, 2, 4);
        graphics.fillRect(pos.x + 2, pos.y - 3, 2, 4);
    }

    createPlayer(gridX, gridY) {
        const pos = gridToScreen(gridX, gridY);
        const depth = calculateDepth(pos.y) + 1; 
        const container = this.add.container(pos.x, pos.y);
        container.setDepth(depth);

        const graphics = this.add.graphics();
        
        graphics.fillStyle(0xffdcb1, 1);
        graphics.fillCircle(0, -35, 8);
        
        graphics.fillStyle(0xe8c850, 1);
        graphics.fillEllipse(0, -42, 20, 6);
        graphics.fillCircle(0, -45, 7);

        graphics.fillStyle(0x3a82e6, 1); 
        graphics.fillRect(-8, -28, 16, 15);
        
        graphics.fillStyle(0xcc3333, 1); 
        graphics.fillRect(-8, -28, 16, 6);

        graphics.fillStyle(0x3a82e6, 1);
        graphics.fillRect(-7, -13, 6, 10);
        graphics.fillRect(1, -13, 6, 10);

        graphics.fillStyle(0x4a2a1a, 1);
        graphics.fillRect(-8, -3, 8, 4);
        graphics.fillRect(0, -3, 8, 4);

        container.add(graphics);
        return container;
    }
}
