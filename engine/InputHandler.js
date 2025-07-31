/**
 * Manages keyboard input for the game.
 */
export default class InputHandler {
	constructor() {
		this.keys = new Set();

		window.addEventListener("keydown", (e) => {
			this.keys.add(e.key.toLowerCase());
		});

		window.addEventListener("keyup", (e) => {
			this.keys.delete(e.key.toLowerCase());
		});
	}

	/**
	 * Checks if a specific key is currently being held down.
	 * @param {string} key - The key to check (e.g., 'w', 'arrowleft').
	 * @returns {boolean} True if the key is pressed, false otherwise.
	 */
	isKeyDown(key) {
		return this.keys.has(key.toLowerCase());
	}
}