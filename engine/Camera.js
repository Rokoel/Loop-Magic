import Vector2D from "./Vector2D.js";

/**
 * Manages the game's viewport, including following objects and zooming.
 */
export default class Camera {
	/**
	 * @param {number} worldWidth - The total width of the game world.
	 * @param {number} worldHeight - The total height of the game world.
	 * @param {number} canvasWidth - The width of the canvas element.
	 * @param {number} canvasHeight - The height of the canvas element.
	 */
	constructor(worldWidth, worldHeight, canvasWidth, canvasHeight) {
		this.position = new Vector2D(0, 0);
		this.worldSize = { width: worldWidth, height: worldHeight };
		this.viewportSize = { width: canvasWidth, height: canvasHeight };
		this.target = null; // The GameObject to follow
		this.zoom = 1.0;
		this.smoothness = 0.05; // Value between 0 and 1 for camera follow speed
	}

	/**
	 * Sets the target for the camera to follow.
	 * @param {GameObject} gameObject - The object to follow.
	 */
	follow(gameObject) {
		this.target = gameObject;
	}

	/**
	 * Updates the camera's position to smoothly follow its target.
	 */
	update() {
		if (!this.target) return;

		// Calculate the desired position (center of the screen on the target)
		const targetX =
			this.target.position.x +
			this.target.size.width / 2 -
			this.viewportSize.width / (2 * this.zoom);
		const targetY =
			this.target.position.y +
			this.target.size.height / 2 -
			this.viewportSize.height / (2 * this.zoom);

		// Smoothly interpolate the camera's position towards the target
		const newX = this.position.x + (targetX - this.position.x) * this.smoothness;
		const newY = this.position.y + (targetY - this.position.y) * this.smoothness;

		this.position.x = newX;
		this.position.y = newY;

		// // Clamp camera to world bounds
		// this.position.x = Math.max(
		// 	0,
		// 	Math.min(this.position.x, this.worldSize.width - this.viewportSize.width / this.zoom)
		// );
		// this.position.y = Math.max(
		// 	0,
		// 	Math.min(this.position.y, this.worldSize.height - this.viewportSize.height / this.zoom)
		// );
	}

	/**
	 * Applies the camera's transformation to the rendering context.
	 * Call this before drawing any game objects.
	 * @param {CanvasRenderingContext2D} ctx - The rendering context.
	 */
	applyTransform(ctx) {
		ctx.save();
		ctx.scale(this.zoom, this.zoom);
		ctx.translate(-this.position.x, -this.position.y);
	}

	/**
	 * Reverts the camera's transformation.
	 * Call this after drawing all game objects.
	 * @param {CanvasRenderingContext2D} ctx - The rendering context.
	 */
	revertTransform(ctx) {
		ctx.restore();
	}
}