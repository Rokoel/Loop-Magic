import { Player, Platform, Box } from "../engine/entities.js";
import { RED_PLATFORM_TEXTURES, LIGHT_ROCK_TEXTURES } from "../engine/textureLoader.js";
import BackgroundRect, { BG_MODE } from "../engine/BackgroundRect.js";
import { applyForce } from "../engine/ForceUtils.js";
import ParticleSystem from "../engine/ParticleSystem.js";

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

  /* runs EVERY frame while scene is current */
  tick(dt, engine) {
    // const inp = engine.input;
    applyForce(engine.getPlayerInstance(), 1, 0); // This is not a proper fix, but I don't have time to deal with this bs
    // engine.timeCtrl.slowOnly(engine.gameObjects.filter(
    //   obj => obj instanceof Box
    // ), 0.1);
    // let player = engine.getPlayerInstance();
    // if (player.isGrounded) {
    //   // console.log("Player is grounded");
    //   engine.particleSystem.emit(player.position.x, player.position.y + player.size.height, 1, "#FFFF00");
    // }
  },

  /* optional – tidy up (stop music, etc.) */
  cleanup(engine) {
    engine.resetWorld();
  }
};