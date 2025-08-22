import { Player, Platform } from "../engine/entities.js";
import { RED_PLATFORM_TEXTURES, LIGHT_ROCK_TEXTURES, SKY, PLATFORM_TEXTURES } from "../engine/textureLoader.js";
import BackgroundRect, { BG_MODE } from "../engine/BackgroundRect.js";
import HUD from "../gui/HUD.js";
import FullScreenImage from "../gui/FullScreenImage.js";
import GameEngine from "../engine/GameEngine.js";
import Vector2D from "../engine/Vector2D.js";

export const Scene4 = {
  init(engine) {
    engine.abilityManager.setAbility("globalTimeReverse", Infinity, Infinity);
    engine.abilityManager.setAbility("localTimeStop", 0, 0);
    engine.abilityManager.reset();

    engine.hud = new HUD(engine, engine.abilityManager);

    const player = new Player(100, 350);
    engine.addGameObject(player);

    engine.addGameObject(new Platform(0, 500, 400, 40, false, RED_PLATFORM_TEXTURES));
    const jumpPlatform = new Platform(600, 450, 128, 50, false, LIGHT_ROCK_TEXTURES);
    jumpPlatform.addTrigger((self, other) => {
      other.velocity.y = -900;
    });
    engine.addGameObject(jumpPlatform);
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
      () => {
        engine.textBox.show(
          "He saw platforms that were able to launch him in the air, helping him reach platforms that were too high to jump to.",
          () => {
            engine.input.setEnabled(true);
          }
        );
      }
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