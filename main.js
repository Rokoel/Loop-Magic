import GameEngine from "./engine/GameEngine.js";
import { importLevel } from "./level/LevelSerializer.js";
import { Player, Platform, Box } from "./engine/entities.js";
import { BG_MODE } from "./engine/BackgroundRect.js";
import BackgroundRect from "./engine/BackgroundRect.js";
import { PLATFORM_TEXTURES, LIGHT_ROCK_TEXTURES, RED_PLATFORM_TEXTURES } from "./engine/textureLoader.js";

// --- Game Setup ---

export async function startGame() {
	const canvas = document.getElementById("gameCanvas");
	const WORLD_WIDTH = 2000;
	const WORLD_HEIGHT = 2000;

	const engine = new GameEngine(canvas, WORLD_WIDTH, WORLD_HEIGHT);
	engine.addBackground(
		new BackgroundRect(-WORLD_WIDTH, -WORLD_HEIGHT, 2*WORLD_WIDTH, 2*WORLD_HEIGHT,
							BG_MODE.TILED,
							LIGHT_ROCK_TEXTURES,
							16*4, 32*4)
		);
	// const data = await fetch("assets/level.json").then(r => r.json());
	// const player = await importLevel(data, engine, { Player, Platform, Box });
	// if (player) {
	// 	engine.camera.follow(player);
	// 	engine.start();
	// }
	const player = new Player(34, 100);
	engine.addGameObject(player);
	const platform = new Platform(150, 200, 400, 500, false, RED_PLATFORM_TEXTURES);
	engine.addGameObject(platform);
	const box = new Box(0, 200, 128, 128, 2, 0.1, "#FFFFFF", "assets/red_rock_tile.png");
	engine.addGameObject(box);
	engine.camera.follow(player);
	engine.start();
}