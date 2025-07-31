import Vector2D from "./Vector2D.js";

/**
 * Represents a single particle in the system.
 */
class Particle {
	constructor(x, y, vx, vy, lifespan, color) {
		this.position = new Vector2D(x, y);
		this.velocity = new Vector2D(vx, vy);
		this.lifespan = lifespan;
		this.initialLifespan = lifespan;
		this.color = color;
	}

	update(deltaTime) {
		this.position = this.position.add(this.velocity.scale(deltaTime));
		this.lifespan -= deltaTime;
	}

	draw(ctx) {
		const alpha = Math.max(0, this.lifespan / this.initialLifespan);
		ctx.globalAlpha = alpha;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.position.x, this.position.y, 3, 3);
		ctx.globalAlpha = 1.0;
	}

	clone() {
		const p = new Particle(
			this.position.x,
			this.position.y,
			this.velocity.x,
			this.velocity.y,
			this.lifespan,
			this.color
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
	 */
	emit(x, y, count, color) {
		for (let i = 0; i < count; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = Math.random() * 100 + 50;
			const vx = Math.cos(angle) * speed;
			const vy = Math.sin(angle) * speed;
			const lifespan = Math.random() * 1 + 0.5;
			this.particles.push(new Particle(x, y, vx, vy, lifespan, color));
		}
	}

	/**
	 * Creates a deep copy of the current particle list for time travel.
	 * @returns {Array<Particle>} A new array with cloned particles.
	 */
	cloneParticles() {
		return this.particles.map((p) => p.clone());
	}

	/**
	 * Replaces the current particle list with a new one (for rewinding).
	 * @param {Array<Particle>} particles - The state to restore.
	 */
	setParticles(particles) {
		this.particles = particles;
	}
}