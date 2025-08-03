import Physics from "./Physics.js";
import InputHandler from "./InputHandler.js";
import Camera from "./Camera.js";
import TimeTravel from "./TimeTravel.js";
import TimeController from "./TimeController.js";
import ParticleSystem from "./ParticleSystem.js";
import { Player } from "./entities.js";
import { drawVignetteOverlay } from "../gui/Vignette.js";

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

		const DPR = window.devicePixelRatio || 1;
		const CSS_WIDTH  = 800;
		const CSS_HEIGHT = 600;

		canvas.style.width  = CSS_WIDTH  + "px";
		canvas.style.height = CSS_HEIGHT + "px";
		canvas.width        = CSS_WIDTH  * DPR;
		canvas.height       = CSS_HEIGHT * DPR;
		this.paused = false;

		this.ctx = canvas.getContext("2d");
		this.ctx.scale(DPR, DPR);                     // make 1 unit = 1 CSS pixel

		this.ctx.imageSmoothingEnabled       = false;
		this.ctx.webkitImageSmoothingEnabled = false; // Safari
		this.ctx.msImageSmoothingEnabled     = false; // old Edge

		this.gameObjects = [];
		this.lastTime = 0;

		this.backgrounds = [];

		this.input = new InputHandler(this.canvas);
		this.physics = new Physics(worldWidth, worldHeight);
		this.camera = new Camera(worldWidth, worldHeight, this.canvas.width, this.canvas.height);
		this.timeTravel = new TimeTravel(60 * 10);
		this.timeCtrl = new TimeController();
		this.particleSystem = new ParticleSystem();
	}

	pause()  { this.paused = true;  }
  	resume() { this.paused = false; }

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
		this.lastTime     = performance.now();
		this.accumulator  = 0;            // time left to simulate (s)
		this.fixedStep    = 1 / 120;      // 120 Hz micro-step  (≈0.0083 s)
		requestAnimationFrame(this.loop.bind(this));
	}

	resetWorld() {
		this.gameObjects.length = 0;
		this.backgrounds.length = 0;
		this.timeCtrl.globalScale = 1;
		this.timeCtrl.locals.clear();
		this.particleSystem.setParticles([]);
	}

	/**
	 * Converts screen (canvas) coordinates to world coordinates.
	 * @param {number} mx - The x coordinate on the screen (pixels).
	 * @param {number} my - The y coordinate on the screen (pixels).
	 * @returns {{x: number, y: number}} The corresponding world coordinates.
	 */
	screenToWorld(mx, my) {
		// If you use zoom, divide by camera.zoom as well
		return {
			x: mx / this.camera.zoom + this.camera.position.x,
			y: my / this.camera.zoom + this.camera.position.y
		};
	}

	/**
	 * The main game loop that runs at a fixed time step.
	 * It accumulates real time and updates the game state accordingly.
	 * @param {number} now - The current time in milliseconds.
	 */
	loop(now = 0) {
		/* accumulate real time -------------------------------------- */
		let frameTime = (now - this.lastTime) / 1000;
		this.lastTime = now;

		/* avoid spiral of death on tab-switch */
		const MAX_FRAME = 0.25;           // 250 ms
		if (frameTime > MAX_FRAME) frameTime = MAX_FRAME;

		this.accumulator += frameTime;

		this.timeCtrl.update(frameTime);
		/* run micro-steps ------------------------------------------- */
		while (this.accumulator >= this.fixedStep) {
			this.update(this.fixedStep);
			this.accumulator -= this.fixedStep;
		}

		if (this.sceneManager) this.sceneManager.tick(frameTime);

		/* one draw per raf ------------------------------------------ */
		this.draw();
		requestAnimationFrame(this.loop.bind(this));
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
				const dtObj = deltaTime * this.timeCtrl.scaleFor(obj);
				obj.update?.(dtObj, this.gameObjects, this.input);
			}
			this.physics.update(this.gameObjects, deltaTime, this.timeCtrl);
  			this.particleSystem.update(deltaTime * this.timeCtrl.globalScale);

			// Record the state for time travel
			this.timeTravel.record(this.gameObjects, this.particleSystem);
		}


		this.camera.update();
	}

	/**
	 * Renders the game world to the canvas.
	 */
	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.camera.applyTransform(this.ctx);

		for (const bg of this.backgrounds) bg.draw(this.ctx);

		for (const obj of this.gameObjects) {
			obj.draw(this.ctx, this.camera);
		}

		this.particleSystem.draw(this.ctx);

		this.camera.revertTransform(this.ctx);

		if (this.showVignette) {
			drawVignetteOverlay(this.ctx, this.canvas.width, this.canvas.height);
		}
		// TODO: UI
	}
	/**
	 * Adds a background to the game engine.
	 * @param {BackgroundRect} bg - The background to add.
	 */
	addBackground(bg)  { this.backgrounds.push(bg); }

	/**
	 * Clears all backgrounds from the game engine.
	 */
	clearBackgrounds() { this.backgrounds.length = 0; }

	getPlayerInstance() {
		return this.gameObjects.filter(obj => obj instanceof Player)[0] || null;
	}
}