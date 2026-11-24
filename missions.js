"use strict";

import { CONFIG } from './config.js';

export class Mission {
    constructor(title, description, destination, reward) {
        this.title = title;
        this.description = description;
        this.destination = destination; // {x, y}
        this.status = 'active';
        this.completed = false;
        this.objectives = [];
        this.reward = reward || 0;
        this.progress = 0;
    }

    addObjective(description) {
        this.objectives.push({ description, completed: false });
    }

    checkCompletion(player) {
        if (this.completed) return false;
        
        const dx = player.x - this.destination.x;
        const dy = player.y - this.destination.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 64) {
            this.completed = true;
            this.status = 'completed';
            return true;
        }
        return false;
    }
}

export class MissionSystem {
    constructor() {
        this.missions = [];
        this.completedToday = [];
    }

    generateMission() {
        const missionTypes = [
            {
                title: 'Visit the Bakery',
                description: 'Go to the local bakery to buy some fresh bread.',
                destinationX: 200, destinationY: 150
            },
            {
                title: 'Meet a Friend',
                description: 'Meet your friend at the park.',
                destinationX: 350, destinationY: 200
            },
            {
                title: 'Go to School',
                description: 'Travel to the school in the next neighborhood.',
                destinationX: 100, destinationY: 100
            },
            {
                title: 'Visit a Neighbor',
                description: 'Visit your neighbor across the street.',
                destinationX: 250, destinationY: 300
            },
            {
                title: 'Collect a Parcel',
                description: 'Pick up a parcel at the USPUT. collection point during your journey.',
                destinationX: 180, destinationY: 250
            }
        ];
        
        const type = missionTypes[Math.floor(Math.random() * missionTypes.length)];
        const mission = new Mission(
            type.title,
            type.description,
            { x: type.destinationX, y: type.destinationY },
            Math.floor(Math.random() * 50) + 10
        );
        
        this.missions.push(mission);
        return mission;
    }

    completeMission(mission) {
        mission.status = 'completed';
        this.completedToday.push(mission.title);
        showNotification(`Mission completed: ${mission.title}`);
        return mission.reward;
    }
}