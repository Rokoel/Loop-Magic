import GameEngine from "./engine/GameEngine.js";
import { importLevel } from "./level/LevelSerializer.js";
import { Player, Platform, Box } from "./engine/entities.js";

// --- Game Setup ---

export default function startGame() {
	const canvas = document.getElementById("gameCanvas");
	const WORLD_WIDTH = 2000;
	const WORLD_HEIGHT = 600;

	const engine = new GameEngine(canvas, WORLD_WIDTH, WORLD_HEIGHT);
	const fileUrl = './assets/level2.json';
	fetch(fileUrl)
		.then(response => response.text())
		.then(text => {
			engine.camera.follow(
				importLevel(JSON.parse(text), engine, { Player, Platform, Box })
			);
		});

	// Create level platforms
	// engine.addGameObject(new Platform(0, 550, WORLD_WIDTH, 50)); // Ground

	// engine.addGameObject(new Box(600, 450, 16*4, 16*4, 0.1, 0.95)); // Stacked box (bottom)
	// engine.addGameObject(new Box(600, 400, 16*4, 16*4, 0.1, 0.95)); // Stacked box (top)
	// engine.addGameObject(new Box(600, 350, 16*4, 16*4, 0.1, 0.95)); // Stacked box (top)
	engine.start();
}