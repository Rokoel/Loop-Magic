import { Player, Platform, Box } from "../engine/entities.js";
import { RED_PLATFORM_TEXTURES, LIGHT_ROCK_TEXTURES } from "../engine/textureLoader.js";
import BackgroundRect, { BG_MODE } from "../engine/BackgroundRect.js";

export const SceneA = {
  /* runs ONCE when scene becomes active */
  init(engine) {
    const player = new Player(34, 100);
    engine.addGameObject(player);

    const platform = new Platform(150, 200, 400, 50, false,
                                  RED_PLATFORM_TEXTURES);
    engine.addGameObject(platform);

    const box = new Box(0, 200, 128, 128, 2, 0.1,
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
    const inp = engine.input;
    engine.timeCtrl.slowOnly([engine.gameObjects[2]], 0.1);
  },

  /* optional – tidy up (stop music, etc.) */
  cleanup(engine) {
    engine.resetWorld();
  }
};