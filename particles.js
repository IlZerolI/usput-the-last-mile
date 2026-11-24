"use strict";

export class Particle {
    constructor(x, y, color, velocity) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity || { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };
        this.life = 1;
        this.decay = 0.01 + Math.random() * 0.01;
        this.size = 4 + Math.random() * 4;
    }

    update(deltaTime) {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.life -= this.decay;
        this.velocity.x *= 0.98;
        this.velocity.y *= 0.98;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(x, y, count, color) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 1;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            this.particles.push(new Particle(x, y, color, velocity));
        }
    }

    update(deltaTime) {
        this.particles = this.particles.filter(p => p.life > 0 && p.life > -0.1);
        this.particles.forEach(p => p.update(deltaTime));
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }
}