import { Player, Platform, Box } from "../engine/entities.js";
import { RED_PLATFORM_TEXTURES, LIGHT_ROCK_TEXTURES, PLATFORM_TEXTURES } from "../engine/textureLoader.js";
import BackgroundRect, { BG_MODE } from "../engine/BackgroundRect.js";
import HUD from "../gui/HUD.js";
import { chooseMovableObjects } from "../engine/InputHandler.js";
import Vector2D from "../engine/Vector2D.js";

export const Scene8 = {
  init(engine) {
    // Abilities: Unlock local time slow (1 use)
    engine.abilityManager.setAbility("globalTimeReverse", Infinity, Infinity);
    engine.abilityManager.setAbility("localTimeStop", Infinity, Infinity);
    engine.abilityManager.setAbility("globalTimeSlow", 0, 0);
    engine.abilityManager.setAbility("timeReverseN", 0, 0, { N: 3 });
    engine.abilityManager.reset();

    engine.hud = new HUD(engine, engine.abilityManager);

    // Level: Gap with a moving box to slow down
    const player = new Player(300, 350);
    engine.addGameObject(player);

    engine.addGameObject(new Platform(0, 500, 678, 40, false, RED_PLATFORM_TEXTURES));
    engine.addGameObject(new Platform(0, -100, 678, 40, false, RED_PLATFORM_TEXTURES));
    engine.addGameObject(new Platform(1100, -150, 200, 40, false, RED_PLATFORM_TEXTURES)); // ending platform
    engine.addGameObject(new Platform(-200, 200, 100, 300, false, RED_PLATFORM_TEXTURES));
    engine.addGameObject(new Platform(778, 200, 100, 300, false, RED_PLATFORM_TEXTURES));
    const movingBox = new Box(450, 300, 128, 128, 2, 0.2, "#FFFFFF", "assets/box.png");
    engine.addGameObject(movingBox);
    const movingBox2 = new Box(100, 300, 128, 128, 2, 0.2, "#FFFFFF", "assets/box.png");
    engine.addGameObject(movingBox2);
    const movingBox3 = new Box(300, -275, 128, 128, 2, 0.2, "#FFFFFF", "assets/box.png");
    engine.addGameObject(movingBox3);

    engine.addBackground(
      new BackgroundRect(-2000, -2000, 4000, 4000, BG_MODE.TILED, LIGHT_ROCK_TEXTURES, 64, 128)
    );

    engine.camera.follow(player);

    window.addEventListener("show:menu", () => engine.menu.show());
    window.addEventListener("scene:restart", () => {
      engine.fadeOut(1, () => {
          window.dispatchEvent(new CustomEvent("scene:change", { detail: "Scene8" }));
          engine.fadeIn(1);
      });
    });

    const jumpPlatform = new Platform(478, 450, 72, 50, false, PLATFORM_TEXTURES);
    jumpPlatform.addTrigger((self, other) => {
        other.velocity.y = -900;
    });
    engine.addGameObject(jumpPlatform);

    const jumpPlatform2 = new Platform(128, 450, 72, 50, false, PLATFORM_TEXTURES);
    jumpPlatform2.addTrigger((self, other) => {
        other.velocity.y = -900;
    });
    engine.addGameObject(jumpPlatform2);
  },

  tick(dt, engine) {
    if (engine.input.isKeyDown("R")) {
      engine.timeTravel.rewind(engine);
    }
    if (engine.input.isKeyDown("E") && engine.abilityManager.use("localTimeStop")) {
      chooseMovableObjects(engine, 1).then(selected => {
        if (selected.length > 0) {
          engine.timeCtrl.fadeGlobal(1, 0.3);
          engine.timeCtrl.slowOnly(selected, 0, 5);
        }
        engine.input.setEnabled(true);
      });
    }

    const player = engine.getPlayerInstance();
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

    if (player && player.position.x >= 1100 && player.position.x + player.size.width <= 1300 && player.position.y + player.size.height >= -300) {
      engine.fadeOut(1, () => {
        window.dispatchEvent(new CustomEvent("scene:change", { detail: "Scene9" }));
        engine.fadeIn(1);
      });
    }
  },

  cleanup(engine) {
    engine.resetWorld();
  }
};