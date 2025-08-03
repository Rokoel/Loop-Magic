import Vector2D from "./Vector2D.js";

/**
 * Represents a single particle in the system.
 */
class Particle {
	constructor(x, y, vx, vy, lifespan, color, texture = null) {
		this.position = new Vector2D(x, y);
		this.velocity = new Vector2D(vx, vy);
		this.lifespan = lifespan;
		this.initialLifespan = lifespan;
		this.color = color;
		this.texture = texture; // ImageBitmap or HTMLImageElement or null
	}

	update(deltaTime) {
		this.position = this.position.add(this.velocity.scale(deltaTime));
		this.lifespan -= deltaTime;
	}

	draw(ctx) {
		const alpha = Math.max(0, this.lifespan / this.initialLifespan);
		ctx.globalAlpha = alpha;
		if (this.texture) {
			ctx.drawImage(this.texture, this.position.x, this.position.y, 6, 6);
		} else {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.position.x, this.position.y, 3, 3);
		}
		ctx.globalAlpha = 1.0;
	}

	clone() {
		const p = new Particle(
			this.position.x,
			this.position.y,
			this.velocity.x,
			this.velocity.y,
			this.lifespan,
			this.color,
			this.texture
		);
		p.initialLifespan = this.initialLifespan;
		return p;
	}
}

/**
 * Manages the creation, updating, and rendering of all particles.
 */
export default class ParticleSystem {
	constructor() {
		this.particles = [];
	}

	/**
	 * Updates all active particles.
	 * @param {number} deltaTime - The time since the last update.
	 */
	update(deltaTime) {
		for (let i = this.particles.length - 1; i >= 0; i--) {
			const p = this.particles[i];
			p.update(deltaTime);
			if (p.lifespan <= 0) {
				this.particles.splice(i, 1);
			}
		}
	}

	/**
	 * Draws all active particles.
	 * @param {CanvasRenderingContext2D} ctx - The rendering context.
	 */
	draw(ctx) {
		for (const p of this.particles) {
			p.draw(ctx);
		}
	}

	/**
	 * Emits a burst of particles from a specific location.
	 * @param {number} x - The x-coordinate of the emission point.
	 * @param {number} y - The y-coordinate of the emission point.
	 * @param {number} count - The number of particles to emit.
	 * @param {string} color - The color of the particles.
	 * @param {ImageBitmap|HTMLImageElement|string} [texture=""] - Optional image for particles.
	 * @param {Array<number>} [angleQuarters=[0, Math.PI/2, Math.PI, 3*Math.PI/2]] - Allowed emission angles.
	 * @param {number} [lifespanModifier=1] - Multiplies the random lifespan.
	 * @param {number} [speedModifier=1] - Multiplies the random speed.
	 * @param {number} [spreadModifier=1] - Multiplies the spread (angle range).
	 */
	emit(
		x,
		y,
		count,
		color,
		texture = "",
		angleQuarters = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2],
		lifespanModifier = 1,
		speedModifier = 1,
		spreadModifier = 1
	) {
		let texObj = null;
		if (texture && typeof texture !== "string") {
			texObj = texture;
		} else if (typeof texture === "string" && texture.length > 0) {
			// If you want to support loading by string, you can add a cache here.
			texObj = null;
		}

		for (let i = 0; i < count; i++) {
			// Pick a base angle from the allowed quarters
			const baseAngle = angleQuarters[Math.floor(Math.random() * angleQuarters.length)];
			// Spread: randomize within ±spreadModifier * (PI/8)
			const spread = (Math.random() - 0.5) * Math.PI / 4 * spreadModifier;
			const angle = baseAngle + spread;

			const speed = (Math.random() * 100 + 50) * speedModifier;
			const vx = Math.cos(angle) * speed;
			const vy = Math.sin(angle) * speed;
			const lifespan = (Math.random() * 1 + 0.5) * lifespanModifier;

			this.particles.push(
				new Particle(x, y, vx, vy, lifespan, color, texObj)
			);
		}
	}

	cloneParticles() {
		return this.particles.map((p) => p.clone());
	}

	setParticles(particles) {
		this.particles = particles;
	}
}

export function emitBoxBorder(ps, box, color = "#FFD700", density = 12, speed = 30) {
    const { x, y } = box.position;
    const { width: w, height: h } = box.size;
    for (let i = 0; i < density; i++) {
        // Top
        ps.particles.push(new Particle(x + (w * i) / density, y, (Math.random() - 0.5) * speed, -Math.random() * speed, 0.3 + Math.random() * 0.3, color));
        // Bottom
        ps.particles.push(new Particle(x + (w * i) / density, y + h, (Math.random() - 0.5) * speed, Math.random() * speed, 0.3 + Math.random() * 0.3, color));
        // Left
        ps.particles.push(new Particle(x, y + (h * i) / density, -Math.random() * speed, (Math.random() - 0.5) * speed, 0.3 + Math.random() * 0.3, color));
        // Right
        ps.particles.push(new Particle(x + w, y + (h * i) / density, Math.random() * speed, (Math.random() - 0.5) * speed, 0.3 + Math.random() * 0.3, color));
    }
}