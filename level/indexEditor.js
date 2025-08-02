import GameEngine from "../engine/GameEngine.js";
import LevelEditor from "./LevelEditor.js";
import { Player, Platform, Box } from "../engine/entities.js";

if (location.href.includes("editor")) {
    /* --- boot like game, but without physics ---------------------- */
    const canvas   = document.getElementById("gameCanvas");
    const WORLD_W  = 2000;
    const WORLD_H  = 600;

    const engine   = new GameEngine(canvas, WORLD_W, WORLD_H);
    /*  physics is never stepped because LevelEditor never calls
        engine.update() – only engine.draw()                     */

    /* empty start scene */
    engine.addGameObject(new Player(50, 300));

    new LevelEditor(engine, { Player, Platform, Box });
}