import { Player, Platform, Box } from "../engine/entities.js";
import { RED_PLATFORM_TEXTURES, LIGHT_ROCK_TEXTURES } from "../engine/textureLoader.js";
import BackgroundRect, { BG_MODE } from "../engine/BackgroundRect.js";
import HUD from "../gui/HUD.js";
import { chooseMovableObjects } from "../engine/InputHandler.js";

export const Scene5 = {
  init(engine) {
    // Abilities: Unlock local time slow (1 use)
    engine.abilityManager.setAbility("globalTimeReverse", Infinity, Infinity);
    engine.abilityManager.setAbility("localTimeStop", Infinity, Infinity);
    engine.abilityManager.reset();

    engine.hud = new HUD(engine, engine.abilityManager);

    // Level: Gap with a moving box to slow down
    const player = new Player(300, 350);
    engine.addGameObject(player);

    engine.addGameObject(new Platform(0, 500, 400, 40, false, RED_PLATFORM_TEXTURES));
    engine.addGameObject(new Platform(700, 400, 300, 40, false, RED_PLATFORM_TEXTURES));
    const movingBox = new Box(500, 470, 128, 128, 2, 0.2, "#FFFFFF", "assets/red_rock_tile.png");
    engine.addGameObject(movingBox);

    engine.addBackground(
      new BackgroundRect(-2000, -2000, 4000, 4000, BG_MODE.TILED, LIGHT_ROCK_TEXTURES, 64, 128)
    );

    engine.camera.follow(player);

    window.addEventListener("show:menu", () => engine.menu.show());
    window.addEventListener("scene:restart", () => {
      engine.fadeOut(1, () => {
          window.dispatchEvent(new CustomEvent("scene:change", { detail: "Scene5" }));
          engine.fadeIn(1);
      });
    });

    // Show dialog
    engine.input.setEnabled(false);
    engine.textBox.show(
      "He has been climbing for a while now, getting stronger. Suddenly, he realized, that he could slow down objects (pressing E and choosing an object with mouse left click does that)",
      () => {
        engine.input.setEnabled(true);
        engine.timeCtrl.slowGlobal(0.05, 0.3);
        this._waitingForBox = true;
        this._slowStartTime = performance.now();
      }
    );
    
  },

  tick(dt, engine) {
    if (engine.input.isKeyDown("R")) {
      engine.timeTravel.rewind(engine);
    }
    if (engine.input.isKeyDown("E") && engine.abilityManager.use("localTimeStop")) {
      engine.input.setEnabled(false);
      engine.textBox.show(
        "Click the box to slow it down! Press ESC to cancel.",
        () => {
          chooseMovableObjects(engine, 1).then(selected => {
            if (selected.length > 0) {
              engine.timeCtrl.fadeGlobal(1, 0.3);
              engine.timeCtrl.slowOnly(selected, 0, 5);
              this._waitingForBox = false;
            }
            engine.input.setEnabled(true);
          });
        }
      );
    }

    if (this._waitingForBox && this._slowStartTime && (performance.now() - this._slowStartTime > 7000)) {
      engine.timeCtrl.fadeGlobal(1, 0.3);
      this._waitingForBox = false;
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

    if (player && player.position.x >= 750 && player.position.x + player.size.width <= 1000) {
      engine.fadeOut(1, () => {
        window.dispatchEvent(new CustomEvent("scene:change", { detail: "Scene6" }));
        engine.fadeIn(1);
      });
    }
  },

  cleanup(engine) {
    engine.resetWorld();
  }
};