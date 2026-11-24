"use strict";

export class WeatherSystem {
    constructor() {
        this.weather = 'clear'; // clear, cloudy, rainy
        this.rainParticles = [];
        this.lastWeatherChange = 0;
        this.weatherChangeInterval = 15000; // 15 seconds for demo
    }

    update(deltaTime) {
        // Change weather periodically for demo
        this.lastWeatherChange += deltaTime;
        if (this.lastWeatherChange > this.weatherChangeInterval) {
            const weathers = ['clear', 'cloudy', 'rainy'];
            this.weather = weathers[Math.floor(Math.random() * weathers.length)];
            this.lastWeatherChange = 0;
        }

        // Emit rain particles if rainy
        if (this.weather === 'rainy') {
            if (Math.random() < 0.01) {
                this.rainParticles.push({
                    x: Math.random() * 800,
                    y: Math.random() * 600,
                    length: 5 + Math.random() * 5,
                    speed: 2 + Math.random() * 2
                });
            }
            // Update and clean up rain particles
            this.rainParticles = this.rainParticles.filter(p => p.y < 600);
            this.rainParticles.forEach(p => {
                p.y += p.speed;
            });
        } else {
            this.rainParticles = [];
        }
    }

    draw(ctx) {
        if (this.weather === 'rainy') {
            // Draw rain particles
            ctx.fillStyle = '#4a90e2';
            this.rainParticles.forEach(p => {
                ctx.fillRect(p.x, p.y, 1, p.length);
            });
        }
    }
}