/**
 * Handles sprite sheet loading, animation, and rendering.
 */
export default class Sprite {
	/**
	 * @param {string} src - The path to the sprite sheet image.
	 * @param {number} frameWidth - The width of a single frame.
	 * @param {number} frameHeight - The height of a single frame.
	 * @param {Object} animations - An object defining animations.
	 *   Example: { run: { frames: [0, 1, 2, 3], speed: 100 }, idle: ... }
	 */
	constructor(src, frameWidth, frameHeight, animations = {}) {
		this.image = new Image();
		this.image.src = src;
		this.frameWidth = frameWidth;
		this.frameHeight = frameHeight;
		this.animations = animations;
		this.currentAnimation = null;
		this.currentFrameIndex = 0;
		this.frameTimer = 0;
		this.isLoaded = false;

		this.image.onload = () => {
			this.isLoaded = true;
			this.cols = this.image.width / this.frameWidth;
		};
	}

	/**
	 * Sets the active animation.
	 * @param {string} name - The name of the animation to play.
	 */
	setAnimation(name) {
		if (this.currentAnimation !== name && this.animations[name]) {
			this.currentAnimation = name;
			this.currentFrameIndex = 0;
			this.frameTimer = 0;
		}
	}

	/**
	 * Updates the current animation frame based on elapsed time.
	 * @param {number} deltaTime - The time since the last update.
	 */
	update(deltaTime) {
		if (!this.currentAnimation || !this.isLoaded) return;

		const anim = this.animations[this.currentAnimation];
		this.frameTimer += deltaTime * 1000; // Convert to milliseconds

		if (this.frameTimer > anim.speed) {
			this.frameTimer = 0;
			this.currentFrameIndex = (this.currentFrameIndex + 1) % anim.frames.length;
		}
	}

	/**
	 * Draws the current animation frame to the canvas.
	 * @param {CanvasRenderingContext2D} ctx - The rendering context.
	 * @param {number} x - The x-coordinate to draw at.
	 * @param {number} y - The y-coordinate to draw at.
	 */
	draw(ctx, x, y) {
		if (!this.isLoaded || !this.currentAnimation) return;

		const anim = this.animations[this.currentAnimation];
		const frame = anim.frames[this.currentFrameIndex];

		const frameX = (frame % this.cols) * this.frameWidth;
		const frameY = Math.floor(frame / this.cols) * this.frameHeight;

		ctx.drawImage(
			this.image,
			frameX,
			frameY,
			this.frameWidth,
			this.frameHeight,
			x,
			y,
			this.frameWidth,
			this.frameHeight
		);
	}

	/**
	 * Clones the current animation state for time travel.
	 * @returns {{currentAnimation: string, currentFrameIndex: number, frameTimer: number}}
	 */
	cloneState() {
		return {
			currentAnimation: this.currentAnimation,
			currentFrameIndex: this.currentFrameIndex,
			frameTimer: this.frameTimer,
		};
	}

	/**
	 * Restores the animation state from a saved state.
	 * @param {Object} state - The state to restore.
	 */
	restoreState(state) {
		this.currentAnimation = state.currentAnimation;
		this.currentFrameIndex = state.currentFrameIndex;
		this.frameTimer = state.frameTimer;
	}
}