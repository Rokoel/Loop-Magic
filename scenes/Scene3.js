import { Player, Platform, Box } from "../engine/entities.js";
import { RED_PLATFORM_TEXTURES, LIGHT_ROCK_TEXTURES, SKY, MAGE_CITY } from "../engine/textureLoader.js";
import BackgroundRect, { BG_MODE } from "../engine/BackgroundRect.js";
import HUD from "../gui/HUD.js";
import FullScreenImage from "../gui/FullScreenImage.js";
import GameEngine from "../engine/GameEngine.js"

export const Scene3 = {
  init(engine) {
    engine.abilityManager.setAbility("globalTimeReverse", Infinity, Infinity);
    engine.abilityManager.setAbility("localTimeSlow", 0, 0);
    engine.abilityManager.setAbility("localTimeStop", 0, 0);
    engine.abilityManager.setAbility("globalTimeSlow", 0, 0);
    engine.abilityManager.setAbility("timeReverseN", 0, 0, { N: 3 });
    engine.abilityManager.reset();

    engine.hud = new HUD(engine, engine.abilityManager);

    const player = new Player(100, 200);
    engine.addGameObject(player);

    engine.addGameObject(new Platform(0, 400, 300, 40, false, RED_PLATFORM_TEXTURES));
    const box = new Box(500, 464, 128, 128, 2, 0.2, "#FFFFFF", "assets/red_rock_tile.png");
    box.isMovable = false;
    this._allowRewind = false;
    box.addTrigger((self, other) => {
      if (other.id === "player") {
        box.isMovable = true;
        engine.input.setEnabled(false);
        engine.textBox.show("The boy was NOT allowed to enter and was laughed at!", () => {
          engine.textBox.show("He started falling to his death...", () => {
            engine.textBox.show("There was nothing he could do... Except concentrate!", () => {
              engine.textBox.show("...So concentrate he did!", () => {
                engine.textBox.show("But NOTHING WAS HAPPENING!!!", () => {
                  engine.textBox.show("Until...", () => {
                    engine.input.setEnabled(true);
                    engine.timeCtrl.slowGlobal(0.1, 0.3);
                    this._allowRewind = true;
                  });
                });
              });
            });
          });
        });
        self.triggers = [];
      }
    });
    engine.addGameObject(box);
    engine.addGameObject(new Platform(800, 400, 1000, 40, false, RED_PLATFORM_TEXTURES));

    engine.addBackground(
      new BackgroundRect(-2000, -2000, 4000, 4000, BG_MODE.TILED, SKY, 32, 256)
    );

    engine.addBackground(
      new BackgroundRect(1000, -2000, 500, 300, BG_MODE.IMAGE, MAGE_CITY)
    );

    engine.camera.follow(player);

    // Menu/restart events
    window.addEventListener("scene:restart", () => {
      window.dispatchEvent(new CustomEvent("scene:change", { detail: "Scene3" }));
    });

    engine.input.setEnabled(false);
    engine.textBox.show(
      "The boy was getting close to the city... " +
      "He was tired, but determined.",
      () => { engine.input.setEnabled(true); }
    );
  },
  /**
   * 
   * @param {*} dt 
   * @param {GameEngine} engine 
   */
  tick(dt, engine) {
    if (engine.input.isKeyDown("R") && this._allowRewind === true) {
      this._beganRewind = true;
      engine.timeTravel.rewind(engine);
      // engine.timeCtrl.fadeGlobal(1, 0.3);
    }
    var player = engine.getPlayerInstance();

    if (this._allowRewind && this._beganRewind && player.position.x <= 250) {
      engine.input.setEnabled(false);
      engine.textBox.show(
        "Until he realized his powers. " +
        "Saving himself in the process.",
        () => {
          engine.textBox.show(
            "Now he was ready to not only *get* to the city..." +
            "He was ready to defeat everyone who mocked him.",
            () => {
              engine.input.setEnabled(true);
              window.dispatchEvent(new CustomEvent("scene:change", { detail: "Scene5" }));
            }
          );
        }
      );
    }

    if (player && player.position.y > 5000) {
      player.returnToInitial();
      engine.input.setEnabled(false);
      engine.textBox.show(
        "He doesn't remember falling to his death - he did complete his journey!",
        () => {
          engine.input.setEnabled(true);
        }
      );
    }
  },

  cleanup(engine) {
    engine.resetWorld();
  }
};