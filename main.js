export async function startGame() {
	const sceneMgr = new SceneManager(engine);
	sceneMgr.register("SceneA", SceneA);
	// sceneMgr.register("SceneB", SceneB);
	engine.sceneManager = sceneMgr;   // hook it in

	sceneMgr.change("SceneA");        // first scene
	engine.start();
}

import GameEngine from "./engine/GameEngine.js";
import SceneManager from "./engine/SceneManager.js";
import { SceneA }   from "./scenes/SceneA.js";
import Menu from "./gui/Menu.js";
import Music from "./gui/Music.js";

const canvas = document.getElementById("gameCanvas");
const engine = new GameEngine(canvas, 2000, 2000);

// Create music instance (replace with your own track)
const music = new Music("assets/music.m4a", 0.3);
music.play(); // start by default

// Show menu
const menu = new Menu({
    onBegin: () => {
        // Start your game, e.g. load scene 1
        window.dispatchEvent(new CustomEvent("scene:change", { detail: "SceneA" }));
    },
    onMusicToggle: (on) => {
        music.setEnabled(on);
    },
    musicOn: false
});
menu.show();