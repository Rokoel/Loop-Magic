import { createRandomTiledCanvas } from "./RandomTileCanvas.js";

/* enum-like */
export const BG_MODE = {
  TILED : "tiled",
  IMAGE : "image",
};

/**
 * BackgroundRect – a non-interactive, non-physical chunk of graphics
 */
export default class BackgroundRect {
  /**
   * @param {number}  x , y , w , h   world-space rectangle
   * @param {BG_MODE} mode            "tiled" | "image"
   * @param {Array<ImageBitmap>|ImageBitmap} textures
   *        – pass ONE bitmap when mode === "image"
   *        – pass an ARRAY when mode === "tiled"
   * @param {number}  minTile   (tiled) smallest square >=16  (default 16)
   * @param {number}  maxTile   (tiled) largest  square       (default ∞)
   */
  constructor(
    x, y, w, h,
    mode,
    textures,
    minTile = 16,
    maxTile = Number.MAX_SAFE_INTEGER
  ) {
    this.position = { x, y };
    this.size     = { w, h };
    this.mode     = mode;

    if (mode === BG_MODE.TILED) {
      this.canvas = createRandomTiledCanvas(
        w, h,
        textures,              // array of square textures
        minTile,
        maxTile
      );
    } else {dsdwdawdwadadwdawd         
      /* IMAGE mode – textures is ONE bitmap */
      this.image = textures;
    }
  }

  draw(ctx) {
    const { x, y } = this.position;
    const { w, h } = this.size;

    if (this.mode === BG_MODE.TILED) {
      ctx.drawImage(this.canvas, x, y);
    } else {
      ctx.drawImage(this.image, x, y, w, h); // stretched
    }
  }

  /* ---------- (de)serialisation helpers ---------------------- */
  toJSON() {
    return {
      x: this.position.x,
      y: this.position.y,
      w: this.size.w,
      h: this.size.h,
      mode : this.mode,
      srcs : this.mode === BG_MODE.TILED
              ? this.texturesSrcs   // store list
              : this.imageSrc,      // store single
      minTile : this.minTile,
      maxTile : this.maxTile,
    };
  }
}