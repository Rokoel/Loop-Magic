import { Player, Platform } from "../engine/entities.js";
import { RED_PLATFORM_TEXTURES, LIGHT_ROCK_TEXTURES, SKY } from "../engine/textureLoader.js";
import BackgroundRect, { BG_MODE } from "../engine/BackgroundRect.js";
import HUD from "../gui/HUD.js";
import FullScreenImage from "../gui/FullScreenImage.js";
import GameEngine from "../engine/GameEngine.js";

export const Scene1 = {
  init(engine) {
    engine.abilityManager.setAbility("globalTimeReverse", 0, 0);
    engine.abilityManager.setAbility("localTimeStop", 0, 0);
    engine.abilityManager.reset();

    engine.hud = new HUD(engine, engine.abilityManager);

    const player = new Player(100, 350);
    engine.addGameObject(player);

    engine.addGameObject(new Platform(0, 500, 400, 40, false, RED_PLATFORM_TEXTURES));
    engine.addGameObject(new Platform(500, 400, 300, 40, false, RED_PLATFORM_TEXTURES));
    engine.addGameObject(new Platform(900, 300, 200, 40, false, RED_PLATFORM_TEXTURES));

    engine.addGameObject(new Platform(1300, 400, 300, 40, false, RED_PLATFORM_TEXTURES));
    engine.addGameObject(new Platform(1600, 600, 200, 40, false, RED_PLATFORM_TEXTURES));
    engine.addGameObject(new Platform(1800, 400, 300, 40, false, RED_PLATFORM_TEXTURES));

    engine.addBackground(
      new BackgroundRect(-2000, -2000, 6000, 4000, BG_MODE.TILED, SKY, 32, 256)
    );

    engine.camera.follow(player);

    // Menu/restart events
    window.addEventListener("scene:restart", () => {
      engine.fadeOut(1, () => {
        window.dispatchEvent(new CustomEvent("scene:change", { detail: "Scene1" }));
        engine.fadeIn(1);
      });
    });
    engine.fadeAlpha = 1;
    engine.fadeIn(1);
    engine.fullScreenImage = new FullScreenImage("assets/scene1_intro.png", () => {
        engine.input.setEnabled(false);
        engine.textBox.show(
          "The boy didn't have magic, but was determined to get to the MAGIC CITY. " +
          "He used W/A/D to move.",
          () => { engine.input.setEnabled(true); }
        );
    });
  },
  /**
   * 
   * @param {*} dt 
   * @param {GameEngine} engine 
   */
  tick(dt, engine) {
    var player = engine.getPlayerInstance();
    if (player && player.position.y+player.size.height > 550 && player.position.x > 1550 && player.position.x < 1850) {
      engine.input.setEnabled(false);
      engine.textBox.show(
        "Obviously, he didn't jump to the platforms he couldn't get up from.",
        () => {
          player.returnToInitial();
          engine.input.setEnabled(true);
        }
      );
    }
    else if (player && player.position.y > 1000) {
      player.returnToInitial();
      engine.input.setEnabled(false);
      engine.textBox.show(
        "He doesn't remember falling to his death - he did complete his journey!",
        () => {
          engine.input.setEnabled(true);
        }
      );
    }
    if (player && player.position.x > 1900 && !this._ending) {
        this._ending = true; // prevent multiple triggers
        engine.input.setEnabled(false);
        engine.textBox.show(
            "He blacked out from time to time. " +
            "He didn't think too much about it though.",
            () => {
                engine.input.setEnabled(true);
                engine.fadeOut(1, () => {
                  window.dispatchEvent(new CustomEvent("scene:change", { detail: "Scene2" }));
                  engine.fadeIn(1);
                });
            }
        );
    }
  },

  cleanup(engine) {
    engine.resetWorld();
  }
};