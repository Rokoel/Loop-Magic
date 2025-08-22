import { Player, Platform } from "../engine/entities.js";
import { RED_PLATFORM_TEXTURES, LIGHT_ROCK_TEXTURES, SKY } from "../engine/textureLoader.js";
import BackgroundRect, { BG_MODE } from "../engine/BackgroundRect.js";
import HUD from "../gui/HUD.js";
import FullScreenImage from "../gui/FullScreenImage.js";
import GameEngine from "../engine/GameEngine.js";

export const Scene9 = {
  init(engine) {

    // Menu/restart events
    window.addEventListener("scene:restart", () => {
      engine.fadeOut(1, () => {
        window.dispatchEvent(new CustomEvent("scene:change", { detail: "Scene9" }));
        engine.fadeIn(1);
      });
    });
    engine.fadeAlpha = 1;
    engine.fadeIn(1);
    this.showing_end = true;
    engine.fullScreenImage = new FullScreenImage("assets/the_end.png", () => {
        if (!engine.menu.visible) engine.menu.show();
        this.showing_end = false;
    });
  },
  /**
   * 
   * @param {*} dt 
   * @param {GameEngine} engine 
   */
  tick(dt, engine) {
    if (!engine.menu.visible && !this.showing_end) {
        engine.menu.show();
    }
  },

  cleanup(engine) {
    engine.resetWorld();
  }
};