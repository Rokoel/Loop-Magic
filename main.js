import GameEngine from "./engine/GameEngine.js";
import { importLevel } from "./level/LevelSerializer.js";
import { Player, Platform, Box } from "./engine/entities.js";
import { BG_MODE } from "./engine/BackgroundRect.js";
import BackgroundRect from "./engine/BackgroundRect.js";
import { PLATFORM_TEXTURES, LIGHT_ROCK_TEXTURES } from "./engine/textureLoader.js";

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
	const data = await fetch("assets/level2.json").then(r => r.json());
	const player = await importLevel(data, engine, { Player, Platform, Box });
	if (player) {
		engine.camera.follow(player);
		engine.start();
	}

	// Create level platforms
	// engine.addGameObject(new Platform(0, 550, WORLD_WIDTH, 50)); // Ground

	// engine.addGameObject(new Box(600, 450, 16*4, 16*4, 0.1, 0.95)); // Stacked box (bottom)
	// engine.addGameObject(new Box(600, 400, 16*4, 16*4, 0.1, 0.95)); // Stacked box (top)
	// engine.addGameObject(new Box(600, 350, 16*4, 16*4, 0.1, 0.95)); // Stacked box (top)
}