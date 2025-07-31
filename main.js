import GameEngine from "./engine/GameEngine.js";
import GameObject from "./engine/GameObject.js";
import Vector2D from "./engine/Vector2D.js";

// --- Custom Game Object Classes ---

class Player extends GameObject {
	constructor(x, y) {
		super(x, y, 40, 60, "cyan");
		this.id = "player"; // Unique ID for time travel
		this.isMovable = true;
		this.mass = 1;
		this.friction = 0.9;
		this.jumpForce = 700;
		this.moveSpeed = 300;
		this.isGrounded = false;
	}

	update(deltaTime, gameObjects, input) {
		// Horizontal movement
		let moveDirection = 0;
		if (input.isKeyDown("a") || input.isKeyDown("arrowleft")) {
			moveDirection = -1;
		} else if (input.isKeyDown("d") || input.isKeyDown("arrowright")) {
			moveDirection = 1;
		}

		this.velocity.x = moveDirection * this.moveSpeed;

		// Jumping - removed the isGrounded = false line since physics handles it
		if ((input.isKeyDown("w") || input.isKeyDown("arrowup")) && this.isGrounded) {
			this.velocity.y = -this.jumpForce;
		}
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
	static count = 0; // Static counter for unique IDs

	constructor(x, y, width, height) {
		super(x, y, width, height, "saddlebrown");
		this.id = `box_${Box.count++}`; // Unique ID for time travel
		this.isMovable = true;
		this.mass = 2; // Heavier than the player
		this.friction = 0.5; // Moderate friction
	}
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
	engine.addGameObject(new Platform(200, 450, 150, 20));
	engine.addGameObject(new Platform(400, 350, 150, 20));
	engine.addGameObject(new Platform(250, 250, 100, 20));
	
	engine.addGameObject(new Box(600, 500)); // A single box on the ground
	engine.addGameObject(new Box(800, 500)); // Bottom box of a stack
	engine.addGameObject(new Box(800, 450)); // Top box of a stack

	// Set camera to follow the player
	engine.camera.follow(player);

	// Start the engine
	engine.start();
});