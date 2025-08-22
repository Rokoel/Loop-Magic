import GameEngine from "./engine/GameEngine.js";
import SceneManager from "./engine/SceneManager.js";
import { Scene1 }   from "./scenes/Scene1.js";
import { Scene2 }   from "./scenes/Scene2.js";
import { Scene3 }   from "./scenes/Scene3.js";
import { Scene4 }   from "./scenes/Scene4.js";
import { Scene5 }   from "./scenes/Scene5.js";
import { Scene6 }   from "./scenes/Scene6.js";
import { Scene7 }   from "./scenes/Scene7.js";
import { Scene8 }   from "./scenes/Scene8.js";
import { Scene9 }   from "./scenes/Scene9.js";

import Menu from "./gui/Menu.js";
import Music from "./gui/Music.js";
import showAbilitiesInfo from "./gui/AbilitiesInfo.js";

const canvas = document.getElementById("gameCanvas");
const engine = new GameEngine(canvas, 1000, 1000);
const sceneMgr = new SceneManager(engine);
const music = new Music("assets/music.m4a", 0.3);
sceneMgr.register("Scene1", Scene1);
sceneMgr.register("Scene2", Scene2);
sceneMgr.register("Scene3", Scene3);
sceneMgr.register("Scene4", Scene4);
sceneMgr.register("Scene5", Scene5);
sceneMgr.register("Scene6", Scene6);
sceneMgr.register("Scene7", Scene7);
sceneMgr.register("Scene8", Scene8);
sceneMgr.register("Scene9", Scene9);
engine.sceneManager = sceneMgr;


const menu = new Menu({
    onBegin: () => {
        startGame();
    },
    onMusicToggle: (on) => {
        music.setEnabled(on);
    },
    musicOn: false
});

engine.menu = menu;
menu.show();

window.addEventListener("show:abilities", () => showAbilitiesInfo(engine.abilityManager));
window.addEventListener("show:menu", () => engine.menu.show());
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (!engine.menu.visible) engine.menu.show();
        else engine.menu.hide();
    }
});

export async function startGame() {
	engine.start();
    window.dispatchEvent(new CustomEvent("scene:change", { detail: "Scene1" }));
    engine.fadeIn(1);
}