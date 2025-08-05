import { Player, Platform } from "../engine/entities.js";
import { RED_PLATFORM_TEXTURES, LIGHT_ROCK_TEXTURES, SKY } from "../engine/textureLoader.js";
import BackgroundRect, { BG_MODE } from "../engine/BackgroundRect.js";
import HUD from "../gui/HUD.js";
import FullScreenImage from "../gui/FullScreenImage.js";

export const Scene1 = {
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

    engine.addBackground(
      new BackgroundRect(-2000, -2000, 4000, 4000, BG_MODE.TILED, SKY, 32, 256)
    );

    engine.camera.follow(player);

    // Menu/restart events
    window.addEventListener("scene:restart", () => {
      window.dispatchEvent(new CustomEvent("scene:change", { detail: "Scene1" }));
    });

    new FullScreenImage("assets/scene1_intro.png", () => {
        new FullScreenImage("assets/scene2_intro.png", () => {
          engine.input.setEnabled(false);
          engine.textBox.show(
            "The boy was determined to get to the city. " +
            "He used W/A/D for that.",
            () => { engine.input.setEnabled(true); }
          );
        });
    });
  },

  tick(dt, engine) {

    var player = engine.getPlayerInstance();
    if (player && player.position.y > 1000) {
      player.returnToInitial();
      engine.input.setEnabled(false);
      engine.textBox.show(
        "He doesn't remember falling to his death - he did complete his journey!",
        () => {
          engine.input.setEnabled(true);
        }
      );
    }
    if (player && player.position.x > 900 && !this._ending) {
        this._ending = true; // prevent multiple triggers
        engine.input.setEnabled(false);
        engine.textBox.show(
            "He blacked out from time to time. " +
            "He didn't think too much about it though.",
            () => {
                engine.input.setEnabled(true);
                window.dispatchEvent(new CustomEvent("scene:change", { detail: "Scene2" }));
            }
        );
    }
  },

  cleanup(engine) {
    engine.resetWorld();
  }
};