"use strict";

import { CONFIG } from './config.js';

export class World {
    constructor(ctx) {
        this.ctx = ctx;
        this.tileSize = CONFIG.tileSize;
        this.grid = this.generateMap();
        this.entities = [];
        this.stations = [];
    }

    generateMap() {
        const grid = [];
        for (let y = 0; y < CONFIG.mapHeight; y++) {
            grid[y] = [];
            for (let x = 0; x < CONFIG.mapWidth; x++) {
                let type = 0;
                if (y < 3 || y > CONFIG.mapHeight - 4) {
                    type = 1;
                } else if (x < 3 || x > CONFIG.mapWidth - 4) {
                    type = 1;
                } else {
                    const r = Math.random();
                    if (r < 0.5) type = 1;
                    else if (r < 0.7) type = 2;
                    else if (r < 0.8) type = 3;
                    else type = 0;
                }
                grid[y][x] = type;
            }
        }
        return grid;
    }

    isSolid(x, y) {
        const gridX = Math.floor(x / this.tileSize);
        const gridY = Math.floor(y / this.tileSize);
        
        if (gridX < 0 || gridX >= CONFIG.mapWidth || gridY < 0 || gridY >= CONFIG.mapHeight) {
            return true;
        }
        
        return this.grid[gridY][gridX] === 1;
    }

    draw() {
        const w = this.ctx.canvas.width, h = this.ctx.canvas.height;
        this.ctx.fillStyle = '#0b1020';
        this.ctx.fillRect(0, 0, w, h);

        for (let y = 0; y < CONFIG.mapHeight; y++) {
            for (let x = 0; x < CONFIG.mapWidth; x++) {
                const type = this.grid[y][x];
                const screenX = x * this.tileSize;
                const screenY = y * this.tileSize;

                if (type === 1) {
                    this.ctx.fillStyle = '#1e293b';
                    this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                    this.ctx.strokeStyle = '#334155';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
                    this.ctx.fillStyle = '#475569';
                    this.ctx.fillRect(screenX + 3, screenY + 3, this.tileSize - 6, this.tileSize - 6);
                } else if (type === 2) {
                    this.ctx.fillStyle = '#14532d';
                    this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                    this.ctx.fillStyle = '#16a34a';
                    this.ctx.fillRect(screenX + 6, screenY + 6, this.tileSize - 12, this.tileSize - 12);
                } else if (type === 3) {
                    this.ctx.fillStyle = '#15803d';
                    this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                    this.ctx.fillStyle = '#22c55e';
                    this.ctx.fillRect(screenX + 6, screenY + 6, this.tileSize - 12, this.tileSize - 12);
                } else {
                    this.ctx.fillStyle = '#0f172a';
                    this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                }
            }
        }
    }
}