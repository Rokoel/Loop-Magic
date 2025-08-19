import { Player, Platform } from "../engine/entities.js";
import { RED_PLATFORM_TEXTURES, LIGHT_ROCK_TEXTURES, SKY } from "../engine/textureLoader.js";
import BackgroundRect, { BG_MODE } from "../engine/BackgroundRect.js";
import HUD from "../gui/HUD.js";
import FullScreenImage from "../gui/FullScreenImage.js";
import GameEngine from "../engine/GameEngine.js";

export const Scene4 = {
  init(engine) {
    engine.abilityManager.setAbility("globalTimeReverse", Infinity, Infinity);
    engine.abilityManager.setAbility("localTimeSlow", 0, 0);
    engine.abilityManager.setAbility("localTimeStop", 0, 0);
    engine.abilityManager.setAbility("globalTimeSlow", 0, 0);
    engine.abilityManager.setAbility("timeReverseN", 0, 0, { N: 3 });
    engine.abilityManager.reset();

    engine.hud = new HUD(engine, engine.abilityManager);

    const player = new Player(100, 350);
    engine.addGameObject(player);

    engine.addGameObject(new Platform(0, 500, 400, 40, false, RED_PLATFORM_TEXTURES));
    engine.addGameObject(new Platform(500, 400, 300, 40, false, RED_PLATFORM_TEXTURES));
    engine.addGameObject(new Platform(900, 300, 200, 40, false, RED_PLATFORM_TEXTURES));

    engine.addGameObject(new Platform(1300, 200, 300, 40, false, RED_PLATFORM_TEXTURES));
    engine.addGameObject(new Platform(1700, 100, 200, 40, false, RED_PLATFORM_TEXTURES));
    engine.addGameObject(new Platform(1300, -50, 300, 40, false, RED_PLATFORM_TEXTURES));
    
    engine.addBackground(
      new BackgroundRect(-2000, -2000, 6000, 4000, BG_MODE.TILED, SKY, 32, 256)
    );

    engine.camera.follow(player);

    // Menu/restart events
    window.addEventListener("scene:restart", () => {
      engine.fadeOut(1, () => {
        window.dispatchEvent(new CustomEvent("scene:change", { detail: "Scene4" }));
        engine.fadeIn(1);
      });
    });
    
    engine.input.setEnabled(false);
    engine.textBox.show(
      "The boy has continued his ascent to the city with his newly realized powers.",
      () => { engine.input.setEnabled(true); }
    );
  },
  /**
   * 
   * @param {*} dt 
   * @param {GameEngine} engine 
   */
  tick(dt, engine) {
    if (engine.input.isKeyDown("R")) {
      engine.timeTravel.rewind(engine);
    }
    var player = engine.getPlayerInstance();
    if (player && player.position.x >= 1300 && player.position.x + player.size.width <= 1600 && player.position.y + player.size.height <= -50) {
      engine.fadeOut(1, () => {
        window.dispatchEvent(new CustomEvent("scene:change", { detail: "Scene5" }));
        engine.fadeIn(1);
      });
    }
  },

  cleanup(engine) {
    engine.resetWorld();
  }
};