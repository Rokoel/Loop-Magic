import Vector2D from "./Vector2D.js";

/**
 * Represents a basic object in the game world.
 * All other game entities should extend this class.
 */
export default class GameObject {
	/**
	 * @param {number} x - The initial x-coordinate.
	 * @param {number} y - The initial y-coordinate.
	 * @param {number} width - The width of the object.
	 * @param {number} height - The height of the object.
	 * @param {string} [color='red'] - The color of the object for debugging.
	 */
	constructor(x, y, width, height, color = "red") {
		this.position = new Vector2D(x, y);
		this.velocity = new Vector2D(0, 0);
		this.size = { width, height };
		this.color = color;

		// Physics properties
		this.isMovable = false;
		this.mass = 10;
		this.friction = 0.9; // Coefficient of friction
		this.forces = new Vector2D(0, 0);

		// Collision properties
		this.isGrounded = false;

		// Sprite and animation
		this.sprite = null;
	}

	/**
	 * Applies a force to the object.
	 * @param {Vector2D} force - The force vector to apply.
	 */
	applyForce(force) {
		this.forces = this.forces.add(force);
	}

	/**
	 * Updates the object's state. Should be overridden by subclasses.
	 * @param {number} deltaTime - The time elapsed since the last frame.
	 * @param {Array<GameObject>} gameObjects - A list of all objects in the scene.
	 */
	update(deltaTime, gameObjects) {
		// To be implemented by subclasses
	}

	/**
	 * Draws the object on the canvas.
	 * @param {CanvasRenderingContext2D} ctx - The rendering context.
	 * @param {Camera} camera - The game camera for viewport transformation.
	 */
	draw(ctx, camera) {
		if (this.sprite) {
			this.sprite.draw(ctx, this.position.x, this.position.y);
		} else {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
		}
	}

	/**
	 * Attaches a sprite to this game object.
	 * @param {Sprite} sprite - The sprite to attach.
	 */
	attachSprite(sprite) {
		this.sprite = sprite;
	}

	/**
	 * Gets the bounding box of the object.
	 * @returns {{min: Vector2D, max: Vector2D}} The AABB.
	 */
	getAABB() {
		return {
			min: this.position,
			max: new Vector2D(
				this.position.x + this.size.width,
				this.position.y + this.size.height
			),
		};
	}
}