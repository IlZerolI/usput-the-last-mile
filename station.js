"use strict";

import { CONFIG } from './config.js';

export class Parcel {
    constructor(id, type, recipient) {
        this.id = id;
        this.type = type; // small, book, electronics, gift, documents, grocery
        this.recipient = recipient;
        this.status = 'available'; // available, collected, in-transit
        this.collectionPoint = null;
        this.collectionCode = Math.floor(100000 + Math.random() * 900000);
    }
}

export class USPUTStation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.compartments = 4;
        this.occupiedCompartments = 0;
        this.parcels = [];
        this.stationId = Math.floor(1000 + Math.random() * 9000);
    }

    addParcel(parcel) {
        this.parcels.push(parcel);
        this.occupiedCompartments = Math.min(this.compartments, this.occupiedCompartments + 1);
    }

    collectParcel() {
        if (this.parcels.length === 0) {
            showNotification('No parcels available at this station.');
            return null;
        }
        
        const parcel = this.parcels.shift();
        this.occupiedCompartments = Math.max(0, this.occupiedCompartments - 1);
        
        parcel.status = 'collected';
        showNotification(`Collected parcel: ${parcel.type}`);
        
        // Add particle effect
        particleSystem.emit(this.x + this.width / 2, this.y + this.height / 2, 15, '#e83e8c');
        
        return parcel;
    }

    draw(ctx) {
        const screenX = this.x;
        const screenY = this.y;
        
        ctx.save();
        ctx.translate(screenX + this.width / 2, screenY + this.height / 2);
        
        // Station base
        ctx.fillStyle = '#2d3748';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // USPUT. branding
        ctx.fillStyle = '#e83e8c';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('USPUT.', 0, -this.height / 2 + 20);
        
        // Compartments
        ctx.fillStyle = '#4a5568';
        const compartmentWidth = this.width / this.compartments;
        for (let i = 0; i < this.compartments; i++) {
            const compX = -this.width / 2 + i * compartmentWidth;
            ctx.fillRect(compX, -this.height / 3 + 10, compartmentWidth - 4, this.height / 3 - 10);
            
            // If compartment has parcel, show red indicator
            if (this.parcels && this.parcels.length > 0 && i < this.parcels.length) {
                ctx.fillStyle = '#e53e3e';
                ctx.fillRect(compX + 4, -this.height / 3 + 14, compartmentWidth - 8, this.height / 3 - 18);
            }
        }
        
        // Digital display
        ctx.fillStyle = '#e83e8c';
        ctx.fillRect(-this.width / 2, this.height / 2 - 20, this.width, 20);
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Station #${this.stationId}`, 0, this.height / 2 - 10);
        
        ctx.restore();
    }
}