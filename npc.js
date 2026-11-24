"use strict";

import { CONFIG } from './config.js';

export class NPC {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.width = 24;
        this.height = 32;
        this.type = type;
        this.direction = 'down';
        this.isMoving = false;
        this.speed = 1.0;
        this.dialogueLines = this.getDialogue();
        this.interactionDistance = 48;
        this.animTimer = 0;
    }

    getDialogue() {
        const dialogues = {
            resident: ["Nice weather today.", "I need to go to the market.", "Have you tried the bakery?", "The bus stop is over there."],
            shopkeeper: ["Welcome! We have fresh bread.", "Don't forget the USPUT. station nearby.", "We have groceries and snacks.", "Thank you for visiting."],
            friend: ["Want to walk to the park?", "I'm heading to the bus stop.", "Did you get the parcel?", "Let's meet at the café later."],
            pedestrian: ["Just walking around.", "Running late for an appointment.", "Enjoying the city view.", "On my way home."]
        };
        return dialogues[this.type] || dialogues.pedestrian;
    }

    update(deltaTime) {
        this.animTimer = (this.animTimer || 0) + deltaTime;
        
        if (this.animTimer > 2000 && !this.isMoving) {
            const directions = ['up', 'down', 'left', 'right'];
            const direction = directions[Math.floor(Math.random() * directions.length)];
            this.startMovingNPC(direction);
            this.animTimer = 0;
        }
    }

    startMovingNPC(direction) {
        const tileSize = CONFIG.tileSize;
        let newX = this.x;
        let newY = this.y;
        
        switch (direction) {
            case 'up': newY -= tileSize; break;
            case 'down': newY += tileSize; break;
            case 'left': newX -= tileSize; break;
            case 'right': newX += tileSize; break;
        }
        
        const corners = [
            { x: newX - this.width/2, y: newY - this.height/2 },
            { x: newX + this.width/2, y: newY - this.height/2 },
            { x: newX - this.width/2, y: newY + this.height/2 },
            { x: newX + this.width/2, y: newY + this.height/2 }
        ];
        
        if (!corners.some(c => world.isSolid(c.x, c.y))) {
            this.targetX = newX;
            this.targetY = newY;
            this.isMoving = true;
            this.direction = direction;
        }
    }

    draw(ctx) {
        const colors = {
            resident: '#3b82f6',
            shopkeeper: '#ef4444',
            friend: '#22c55e',
            pedestrian: '#94a3b8'
        };
        const color = colors[this.type] || '#94a3b8';

        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.shadowBlur = 0;

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