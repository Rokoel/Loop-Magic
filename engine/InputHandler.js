/**
 * Manages keyboard input for the game.
 */
export default class InputHandler {
	constructor(canvas = document) {
		this.keys = new Set();

		window.addEventListener("keydown", (e) => {
			this.keys.add(e.key.toLowerCase());
		});

		window.addEventListener("keyup", (e) => {
			this.keys.delete(e.key.toLowerCase());
		});

		this.mouse = new Set();

		document.addEventListener("mousedown", (e) => {
			if (e.button === 1 || e.button === 2) e.preventDefault();         // stop auto-scroll
			this.mouse.add(e.button);
		});
		document.addEventListener("mouseup", (e) => {
			if (e.button === 1 || e.button === 2) e.preventDefault();
			this.mouse.delete(e.button);
		});
	}
	/**
	 * Checks if the middle mouse button is currently pressed.
	 * @returns {boolean} True if the middle button is pressed, false otherwise.
	 */
	isMiddleDown()    { return this.mouse.has(1); }
	isLeftDown()      { return this.mouse.has(0); }
	isRightDown()     { return this.mouse.has(2); }

	/**
	 * Checks if a specific key is currently being held down.
	 * @param {string} key - The key to check (e.g., 'w', 'arrowleft').
	 * @returns {boolean} True if the key is pressed, false otherwise.
	 */
	isKeyDown(key) {
		return this.keys.has(key.toLowerCase());
	}
}