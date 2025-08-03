import GameEngine from "./engine/GameEngine.js";
import SceneManager from "./engine/SceneManager.js";
import { SceneA }   from "./scenes/SceneA.js";

const canvas = document.getElementById("gameCanvas");
const engine = new GameEngine(canvas, 2000, 2000);

// --- Game Setup ---

export async function startGame() {
	const sceneMgr = new SceneManager(engine);
	sceneMgr.register("SceneA", SceneA);
	// sceneMgr.register("SceneB", SceneB);
	engine.sceneManager = sceneMgr;   // hook it in

	sceneMgr.change("SceneA");        // first scene
	engine.start();
}