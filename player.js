"use strict";

import { CONFIG } from './config.js';

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.width = 24;
        this.height = 32;
        this.speed = CONFIG.playerSpeed;
        this.velocityX = 0;
        this.velocityY = 0;
        this.direction = 'down';
        this.isMoving = false;
        this.isSprinting = false;
        this.currentAnimFrame = 0;
        this.animTimer = 0;
    }

    init() {
        this.x = CONFIG.tileSize * 3;
        this.y = CONFIG.tileSize * 3;
        this.targetX = this.x;
        this.targetY = this.y;
    }

    update(deltaTime) {
        if (this.isMoving) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > this.speed * deltaTime) {
                this.x += (dx / distance) * this.speed * deltaTime;
                this.y += (dy / distance) * this.speed * deltaTime;
                this.isMoving = true;
            } else {
                this.x = this.targetX;
                this.y = this.targetY;
                this.isMoving = false;
            }
            
            if (Math.abs(dx) > Math.abs(dy)) {
                this.direction = dx > 0 ? 'right' : 'left';
            } else {
                this.direction = dy > 0 ? 'down' : 'up';
            }
        }
        
        this.animTimer += deltaTime;
        if (this.animTimer > 100 && this.isMoving) {
            this.currentAnimFrame = (this.currentAnimFrame + 1) % 4;
            this.animTimer = 0;
        }
    }

    startMoving(direction) {
        const tileSize = CONFIG.tileSize;
        let newX = this.x;
        let newY = this.y;
        
        switch (direction) {
            case 'up': newY -= tileSize; break;
            case 'down': newY += tileSize; break;
            case 'left': newX -= tileSize; break;
            case 'right': newX += tileSize; break;
        }
        
        if (!this.isPositionBlocked(newX, newY)) {
            this.targetX = newX;
            this.targetY = newY;
            this.isMoving = true;
        }
    }

    isPositionBlocked(x, y) {
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        
        const corners = [
            { x: x - halfWidth, y: y - halfHeight },
            { x: x + halfWidth, y: y - halfHeight },
            { x: x - halfWidth, y: y + halfHeight },
            { x: x + halfWidth, y: y + halfHeight }
        ];
        
        return corners.some(corner => world.isSolid(corner.x, corner.y));
    }

    startSprinting() {
        this.isSprinting = true;
    }

    stopSprinting() {
        this.isSprinting = false;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        const grad = ctx.createLinearGradient(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2);
        const color = this.isSprinting ? '#be185d' : '#e83e8c';
        grad.addColorStop(0, color);
        grad.addColorStop(1, '#8b5cf6');
        ctx.fillStyle = grad;
        ctx.shadowColor = color;
        ctx.shadowBlur = this.isSprinting ? 20 : 12;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.shadowBlur = 0;

        // Direction indicator
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        const arrowSize = this.width / 3;
        switch (this.direction) {
            case 'up': ctx.moveTo(0, -this.height/2); ctx.lineTo(arrowSize, this.height/2); ctx.lineTo(-arrowSize, this.height/2); break;
            case 'down': ctx.moveTo(0, this.height/2); ctx.lineTo(arrowSize, -this.height/2); ctx.lineTo(-arrowSize, -this.height/2); break;
            case 'left': ctx.moveTo(-this.width/2, 0); ctx.lineTo(this.width/2, arrowSize); ctx.lineTo(this.width/2, -arrowSize); break;
            case 'right': ctx.moveTo(this.width/2, 0); ctx.lineTo(-arrowSize, arrowSize); ctx.lineTo(-arrowSize, -arrowSize); break;
        }
        ctx.fill();

        ctx.restore();
    }
}