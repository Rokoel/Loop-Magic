import { Player, Platform, Box } from "../engine/entities.js";
import { RED_PLATFORM_TEXTURES, LIGHT_ROCK_TEXTURES } from "../engine/textureLoader.js";
import BackgroundRect, { BG_MODE } from "../engine/BackgroundRect.js";
import { applyForce } from "../engine/ForceUtils.js";
import GameEngine from "../engine/GameEngine.js";
import { chooseMovableObjects } from "../engine/InputHandler.js";

export const SceneA = {
  /* runs ONCE when scene becomes active */
  init(engine) {
    const player = new Player(50, 50);
    engine.addGameObject(player);

    const platform = new Platform(-200, 200, 1000, 500, false,
                                  RED_PLATFORM_TEXTURES);
    engine.addGameObject(platform);

    const box = new Box(150, 50, 128, 128, 2, 0.1,
                        "#FFFFFF", "assets/red_rock_tile.png");
    engine.addGameObject(box);

    engine.addBackground(
            new BackgroundRect(-2000, -2000, 2*2000, 2*2000,
                                BG_MODE.TILED,
                                LIGHT_ROCK_TEXTURES,
                                16*4, 32*4)
            );

    engine.camera.follow(player);
  },

  /**
   * 
   * @param {*} dt 
   * @param {GameEngine} engine 
   */
  tick(dt, engine) {
    // const inp = engine.input;
    applyForce(engine.getPlayerInstance(), 1, 0); // This is not a proper fix, but I don't have time to deal with this bs
    // engine.timeCtrl.slowOnly(engine.gameObjects.filter(
    //   obj => obj instanceof Box
    // ), 0.1);
    let player = engine.getPlayerInstance();
    if (player.isGrounded) {
      // LIGHT_ROCK_TEXTURES[Math.floor(Math.random() * LIGHT_ROCK_TEXTURES.length)]
      if (Math.sign(player.velocity.x) === 1) {
        engine.particleSystem.emit(
          player.position.x + player.size.width/2 - Math.random()*16 - 8, player.position.y + player.size.height - 5, 1, "#4e4125ff",
          "",
          [-1/4*Math.PI],
          0.3, 0.5, Math.PI/2
        );
      }
      else if (Math.sign(player.velocity.x) === -1) {
        engine.particleSystem.emit(
          player.position.x + player.size.width/2 + Math.random()*16 + 8, player.position.y + player.size.height - 5, 1, "#4e4125ff", 
          "",
          [5/4*Math.PI],
          0.3, 0.5, Math.PI/2
        );
      }
    }

    if (engine.input.isKeyDown("E")) {
      chooseMovableObjects(engine, 1).then(selected => {
          if (selected.length === 0) {
              console.log("No objects selected");
          } else {
              console.log("You picked:", selected);
              engine.timeCtrl.slowOnly(selected, 0.1, 5);
          }
      });
    }
  },

  /* optional – tidy up (stop music, etc.) */
  cleanup(engine) {
    engine.resetWorld();
  }
};