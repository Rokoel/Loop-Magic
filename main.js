import GameEngine from "./engine/GameEngine.js";
import GameObject from "./engine/GameObject.js";
import MultiSprite from "./engine/MultiSprite.js";
import Sprite from "./engine/Sprite.js";

// --- Custom Game Object Classes ---

class Player extends GameObject {
	constructor(x, y) {
		super(x, y, 16*4, 32*4, "cyan");
		this.id = "player"; // Unique ID for time travel
		this.isMovable = true;
		this.mass = 1;
		this.friction = 0.9;
		this.jumpForce = 700;
		this.moveSpeed = 300;
		this.isGrounded = false;

		const sheet = new MultiSprite({
		idle : { src: "assets/player_idle.png",
				w: 16, h: 32, frames:[0, 1], speed: 1000 },
		run  : { src: "assets/player_run.png",
				w: 16, h: 32, frames:[0, 1], speed: 200 },
		crouch : { src: "assets/player_jump.png",
				w: 16, h: 32, frames:[1], speed: 1000 },
		jump : { src: "assets/player_jump.png",
				w: 16, h: 32, frames:[2], speed: 1000 }
		}, 4);

		sheet.setAnimation("idle");
		this.attachSprite(sheet);
	}

	update(deltaTime, gameObjects, input) {
		// Horizontal movement
		let moveDirection = 0;
		let isIdle = true;
		if (input.isKeyDown("a") || input.isKeyDown("arrowleft")) {
			moveDirection = -1;
			this.sprite.setAnimation("run");
			isIdle = false;
		} else if (input.isKeyDown("d") || input.isKeyDown("arrowright")) {
			moveDirection = 1;
			this.sprite.setAnimation("run");
			isIdle = false;
		}

		if (input.isKeyDown("s") || input.isKeyDown("arrowdown")) {
			this.sprite.setAnimation("crouch");
			this.size = {width: 16*4, height: 32*4}; // Crouch size
			
			isIdle = false;
		}
		else {
			this.size = {width: 16*4, height: 32*4}; // Normal size
			if (isIdle) this.sprite.setAnimation("idle");
		}

		this.velocity.x = moveDirection * this.moveSpeed;

		if ((input.isKeyDown("w") || input.isKeyDown("arrowup")) && this.isGrounded) {
			this.velocity.y = -this.jumpForce;
			this.sprite.setAnimation("jump");
			isIdle = false;
		}
		if (isIdle && this.isGrounded) {
			this.sprite.setAnimation("idle");
		}
		if (this.sprite) this.sprite.update(deltaTime);
	}

	draw(ctx, camera) {
		const facingLeft = this.velocity.x < 0;
		this.sprite.draw(ctx, this.position.x, this.position.y, facingLeft);
	}
}

class Platform extends GameObject {
	constructor(x, y, width, height, isOneWay = false) {
		super(x, y, width, height, "#4CAF50");
		this.isMovable = false;
		this.isOneWay = isOneWay;
		if (isOneWay) {
			this.color = "#FFC107"; // Different color for one-way platforms
		}
	}
}

class Box extends GameObject {
	/**
	 * A movable box that can be pushed, stacked, and used to push other objects.
	 * @param {number} x - The initial x-coordinate.
	 * @param {number} y - The initial y-coordinate.
	 * @param {number} width - The width of the box.
	 * @param {number} height - The height of the box.
	 * @param {number} [mass=2] - The mass of the box (higher mass makes it harder to push).
	 * @param {number} [friction=0.1] - The friction coefficient (higher for better stacking stability).
	 * @param {string} [color='#8B4513'] - The color of the box for debugging.
	 */
	constructor(x, y, width, height, mass = 2, friction = 0.1, color = "#8B4513") {
		super(x, y, width, height, color);
		this.id = `box_${Math.random().toString(36).substr(2, 9)}`; // Unique ID for time travel
		this.isMovable = true;
		this.mass = mass;
		this.friction = friction;

		this.sprite = new Sprite("assets/box.png", 16, 16, {
			idle: { frames: [0], speed: 1000 }
		}, 4);
		this.sprite.setAnimation("idle");
	}

	update(deltaTime, gameObjects, input) {
		if (this.sprite) this.sprite.update(deltaTime);
	}

	// No custom update logic needed; physics handles movement via forces and collisions
}

// --- Game Setup ---

document.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("gameCanvas");
	const WORLD_WIDTH = 2000;
	const WORLD_HEIGHT = 600;

	const engine = new GameEngine(canvas, WORLD_WIDTH, WORLD_HEIGHT);

	// Create player
	const player = new Player(100, 300);
	engine.addGameObject(player);

	// Create level platforms
	engine.addGameObject(new Platform(0, 550, WORLD_WIDTH, 50)); // Ground
	// engine.addGameObject(new Platform(200, 450, 150, 20));
	// engine.addGameObject(new Platform(400, 350, 150, 20));
	// engine.addGameObject(new Platform(250, 250, 100, 20));
	
	engine.addGameObject(new Box(600, 450, 16*4, 16*4, 0.1, 0.95)); // Stacked box (bottom)
	engine.addGameObject(new Box(600, 400, 16*4, 16*4, 0.1, 0.95)); // Stacked box (top)
	engine.addGameObject(new Box(600, 350, 16*4, 16*4, 0.1, 0.95)); // Stacked box (top)

	// Set camera to follow the player
	engine.camera.follow(player);

	// Start the engine
	engine.start();
});