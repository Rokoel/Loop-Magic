import Physics from "./Physics.js";
import InputHandler from "./InputHandler.js";
import Camera from "./Camera.js";
import TimeTravel from "./TimeTravel.js";
import ParticleSystem from "./ParticleSystem.js";

/**
 * The main orchestrator for the game. Manages the game loop,
 * state, and all engine subsystems.
 */
export default class GameEngine {
	/**
	 * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
	 * @param {number} worldWidth - The total width of the game world.
	 * @param {number} worldHeight - The total height of the game world.
	 */
	constructor(canvas, worldWidth, worldHeight) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.canvas.width = 800;
		this.canvas.height = 600;

		this.gameObjects = [];
		this.lastTime = 0;

		// Initialize engine subsystems
		this.input = new InputHandler();
		this.physics = new Physics(worldWidth, worldHeight);
		this.camera = new Camera(worldWidth, worldHeight, this.canvas.width, this.canvas.height);
		this.timeTravel = new TimeTravel();
		this.particleSystem = new ParticleSystem();
	}

	/**
	 * Adds a game object to the engine's management.
	 * @param {GameObject} obj - The game object to add.
	 */
	addGameObject(obj) {
		this.gameObjects.push(obj);
	}

	/**
	 * Starts the main game loop.
	 */
	start() {
		this.lastTime = performance.now();
		this.gameLoop();
	}

	/**
	 * The main game loop, called once per frame.
	 * @param {number} timestamp - The current time provided by requestAnimationFrame.
	 */
	gameLoop(timestamp = 0) {
		const deltaTime = (timestamp - this.lastTime) / 1000; // Time in seconds
		this.lastTime = timestamp;

		this.update(deltaTime);
		this.draw();

		requestAnimationFrame(this.gameLoop.bind(this));
	}

	/**
	 * Updates the state of the game world.
	 * @param {number} deltaTime - The time elapsed since the last frame.
	 */
	update(deltaTime) {
		if (this.input.isKeyDown("r")) {
			// Rewind time
			this.timeTravel.rewind(this.gameObjects, this.particleSystem);
		} else {
			// Normal update
			for (const obj of this.gameObjects) {
				obj.update(deltaTime, this.gameObjects, this.input);
			}
			this.physics.update(this.gameObjects, deltaTime);
			this.particleSystem.update(deltaTime);

			// Record the state for time travel
			this.timeTravel.record(this.gameObjects, this.particleSystem);
		}

		this.camera.update();
	}

	/**
	 * Renders the game world to the canvas.
	 */
	draw() {
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Apply camera transformations
		this.camera.applyTransform(this.ctx);

		// Draw all game objects
		for (const obj of this.gameObjects) {
			obj.draw(this.ctx, this.camera);
		}

		// Draw particles
		this.particleSystem.draw(this.ctx);

		// Revert camera transformations to draw UI if needed
		this.camera.revertTransform(this.ctx);
	}
}