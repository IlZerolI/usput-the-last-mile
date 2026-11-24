"use strict";

export class AudioManager {
    constructor() {
        this.context = null;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        this.init();
    }

    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    playFootstep(direction) {
        if (!this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = direction === 'up' ? 440 : direction === 'down' ? 330 : direction === 'left' ? 294 : 261;
        oscillator.frequency.value *= 0.5 + Math.random() * 0.3;
        
        gainNode.gain.value = this.sfxVolume * 0.1;
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.start();
        setTimeout(() => { oscillator.stop(); }, 100);
    }

    playInteraction() {
        if (!this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.value = 523 + Math.random() * 100;
        
        gainNode.gain.value = this.sfxVolume * 0.2;
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.start();
        setTimeout(() => { oscillator.stop(); }, 150);
    }

    playParcelPickup() {
        if (!this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        const filter = this.context.createBiquadFilter();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 659;
        
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        
        gainNode.gain.value = this.sfxVolume * 0.15;
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.start();
        setTimeout(() => { oscillator.stop(); }, 200);
    }

    playMissionComplete() {
        if (!this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 440;
        
        gainNode.gain.value = this.sfxVolume * 0.3;
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.start();
        setTimeout(() => { oscillator.stop(); }, 500);
    }
}