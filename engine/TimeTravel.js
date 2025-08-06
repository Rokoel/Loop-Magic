// import GameEngine from "./GameEngine";

/**
 * Manages the recording and rewinding of game state for the time travel mechanic.
 */
export default class TimeTravel {
	constructor(maxHistory = 300) {
		this.history = [];
		this.maxHistory = maxHistory; // Store ~5 seconds of history at 60fps
	}

	/**
	 * Records the current state of all relevant game objects.
	 * @param {Array<GameObject>} gameObjects - The list of all game objects.
	 * @param {ParticleSystem} particleSystem - The game's particle system.
	 */
	record(gameObjects, particleSystem) {
		const state = {
			objects: [],
			particles: particleSystem.cloneParticles(),
		};

		for (const obj of gameObjects) {
			if (obj.isMovable) {
				state.objects.push({
					id: obj.id, // We'll need to assign IDs to objects
					position: obj.position.clone(),
					velocity: obj.velocity.clone(),
					// Also store animation state if applicable
					animationState: obj.sprite ? obj.sprite.cloneState() : null,
				});
			}
		}

		this.history.push(state);

		if (this.history.length > this.maxHistory) {
			this.history.shift(); // Remove the oldest state
		}
	}

	/**
	 * Rewinds the game state by one frame.
	 * @param {GameEngine} engine
	 */
	rewind(engine) {
		if (this.history.length <= 1) return; // Can't rewind past the beginning

		const lastState = this.history.pop();

		// Restore object states
		for (const state of lastState.objects) {
			const obj = engine.gameObjects.find((go) => go.id === state.id);
			if (obj) {
				obj.position = state.position;
				obj.velocity = state.velocity;
				if (obj.sprite && state.animationState) {
					obj.sprite.restoreState(state.animationState);
				}
			}
		}

		// Restore particle system state
		engine.particleSystem.setParticles(lastState.particles);
		engine.ignoreNormalUpdate = true;
	}
}