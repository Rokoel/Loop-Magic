import { Player, Platform, Box } from "../engine/entities.js";
import { RED_PLATFORM_TEXTURES, LIGHT_ROCK_TEXTURES } from "../engine/textureLoader.js";
import BackgroundRect, { BG_MODE } from "../engine/BackgroundRect.js";
import HUD from "../gui/HUD.js";

export const Scene2 = {
  init(engine) {
    // Abilities: Only global time reverse (infinite), others locked
    engine.abilityManager.setAbility("globalTimeReverse", Infinity, Infinity);
    engine.abilityManager.setAbility("localTimeSlow", 0, 0);
    engine.abilityManager.setAbility("localTimeStop", 0, 0);
    engine.abilityManager.setAbility("globalTimeSlow", 0, 0);
    engine.abilityManager.setAbility("timeReverseN", 0, 0, { N: 3 });
    engine.abilityManager.reset();

    engine.hud = new HUD(engine, engine.abilityManager);

    const player = new Player(100, 300);
    engine.addGameObject(player);

    engine.addGameObject(new Platform(0, 500, 900, 1000, false, RED_PLATFORM_TEXTURES));
    engine.addGameObject(new Platform(900, 200, 2000, 1000, false, RED_PLATFORM_TEXTURES));
    engine.addGameObject(new Box(300, 300, 128, 128, 2, 0.2));

    engine.addBackground(
      new BackgroundRect(-2000, -2000, 4000, 4000, BG_MODE.TILED, LIGHT_ROCK_TEXTURES, 64, 128)
    );

    engine.camera.follow(player);

    window.addEventListener("show:menu", () => engine.menu.show());
    window.addEventListener("scene:restart", () => {
      window.dispatchEvent(new CustomEvent("scene:change", { detail: "Scene2" }));
    });

    // Show dialog

    engine.input.setEnabled(false);
    engine.textBox.show(
      "He encountered different obstacles on his way. " +
      "Some of them were *pushable*.",
      () => { engine.input.setEnabled(true); }
    );
  },

  tick(dt, engine) {
    // Transition to next scene if player reaches the last platform
    var player = engine.getPlayerInstance();
    if (player && player.position.y > 1000) {
      player.position.x = 100;
      player.position.y = 400;
      engine.input.setEnabled(false);
      engine.textBox.show(
        "He doesn't remember falling to his death - he did complete his journey!",
        () => {
          engine.input.setEnabled(true);
        }
      );
    }
    if (player && player.position.x > 1000 && !this._ending) {
      this._ending = true;
      engine.input.setEnabled(false);
      engine.textBox.show(
        "And though at first he didn't use the newly obtained powers that much, he knew that he could access reversing time at any point by pressing R.",
        () => {
          engine.input.setEnabled(true);
          window.dispatchEvent(new CustomEvent("scene:change", { detail: "Scene3" }));
        }
      );
    }
  },

  cleanup(engine) {
    engine.resetWorld();
  }
};