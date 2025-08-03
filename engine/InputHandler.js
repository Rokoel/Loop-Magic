import { emitBoxBorder } from "./ParticleSystem.js";

/**
 * Manages keyboard input for the game.
 */
export default class InputHandler {
	constructor(canvas = document) {
        this.enabled = true;
		this.keys = new Set();

		window.addEventListener("keydown", (e) => {
			this.keys.add(e.key.toLowerCase());
		});

		window.addEventListener("keyup", (e) => {
			this.keys.delete(e.key.toLowerCase());
		});

		this.mouse = new Set();

		document.addEventListener("mousedown", (e) => {
			if (e.button === 1 || e.button === 2) e.preventDefault();
			this.mouse.add(e.button);
		});
		document.addEventListener("mouseup", (e) => {
			if (e.button === 1 || e.button === 2) e.preventDefault();
			this.mouse.delete(e.button);
		});
	}
    
	isKeyDown(k)      { return this.enabled && this.keys.has(k.toLowerCase()); }
    isMiddleDown()    { return this.enabled && this.mouse.has(1); }
    isLeftDown()      { return this.enabled && this.mouse.has(0); }
    isRightDown()     { return this.enabled && this.mouse.has(2); }

    setEnabled(on)    { this.enabled = !!on; }
}

/**
 * Lets the user pick N movable objects by clicking them.
 * Shows a vignette overlay and highlights hovered object with particles.
 * @param {GameEngine} engine
 * @param {number} count - number of objects to pick
 * @returns {Promise<Array<GameObject>>}
 */
export function chooseMovableObjects(engine, count) {
    return new Promise(resolve => {
        const canvas = engine.canvas;
        const movables = engine.gameObjects.filter(o => o.isMovable);
        const chosen = [];
        let active = true;
        let hovered = null;

        // Mouse move handler to update hovered object
        function onMove(e) {
			const rect = canvas.getBoundingClientRect();
			const mx = e.clientX - rect.left;
			const my = e.clientY - rect.top;

			// Convert to world coordinates
			const { x: wx, y: wy } = engine.screenToWorld(mx, my);

			hovered = null;
			for (let i = movables.length - 1; i >= 0; i--) {
				const o = movables[i];
				if (
					wx >= o.position.x && wx <= o.position.x + o.size.width &&
					wy >= o.position.y && wy <= o.position.y + o.size.height &&
					!chosen.includes(o)
				) {
					hovered = o;
					break;
				}
			}
		}

        // Draw vignette and highlights every frame
        function drawEffects() {
            if (!active) return;
            engine.draw(); // redraw scene
            engine.showVignette = true

            // Highlight already chosen
            for (const obj of chosen) {
                const ctx = canvas.getContext("2d");
                ctx.save();
                ctx.strokeStyle = "#FFD700";
                ctx.lineWidth = 4;
                ctx.strokeRect(obj.position.x, obj.position.y, obj.size.width, obj.size.height);
                ctx.restore();
            }

            // Particle border for hovered
            if (hovered) {
                emitBoxBorder(engine.particleSystem, hovered, "#FFD700", 16, 40);
            }

            requestAnimationFrame(drawEffects);
        }
        drawEffects();

        // Mouse click handler
        function onClick(e) {
            if (!active) return;
            if (hovered && !chosen.includes(hovered)) {
                chosen.push(hovered);
                if (chosen.length >= count) finish();
            }
        }

        // Escape key handler
        function onKey(e) {
            if (e.key === "Escape") {
                finish(true);
            }
        }

        function finish(cancelled = false) {
            active = false;
			engine.showVignette = false;
            window.removeEventListener("mousedown", onClick);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("keydown", onKey);
            engine.draw(); // redraw scene to clear vignette
            resolve(cancelled ? [] : chosen);
        }

        window.addEventListener("mousedown", onClick);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("keydown", onKey);
    });
}