/**
 * MultiSprite
 * -----------
 * A sprite component that can play several animations,
 * each coming from a different sprite-sheet file.
 *
 * Usage:
 *   const sprite = new MultiSprite({
 *     idle : { src: "assets/idle.png",
 *              w: 16, h: 24,
 *              frames: [0,1,2,3], speed: 200 },
 *     run  : { src: "assets/run.png",
 *              w: 16, h: 24,
 *              frames: [0,1,2,3,4,5], speed: 90 },
 *     jump : { src: "assets/jump.png",
 *              w: 16, h: 24,
 *              frames: [0], speed: 100 }
 *   }, 4);                      // scale ×4 on screen
 *
 *   sprite.setAnimation("run");
 *   sprite.update(dt);
 *   sprite.draw(ctx, x, y, flipX);
 */
export default class MultiSprite {
  /**
   * @param {Object}  sheets  map name → {src,w,h,frames,speed}
   * @param {number}  scale   draw-scale (1 = native pixels)
   */
  constructor(sheets, scale = 1) {
    this.scale      = scale;
    this.animations = {};
    this.cache      = {};     // src → Image (loaded once)

    for (const [name, info] of Object.entries(sheets)) {
      const img   = this.loadImage(info.src);
      const cols  = () => img.width / info.w;

      this.animations[name] = {
        image   : img,
        frameW  : info.w,
        frameH  : info.h,
        frames  : info.frames,
        speed   : info.speed,
        cols,
      };
    }

    this.current   = null;
    this.frameIdx  = 0;
    this.timer     = 0;
  }

  /* -------------- public API ---------------- */
  setAnimation(name) {
    if (!this.animations[name]) return;
    if (this.current !== name) {
      this.current  = name;
      this.frameIdx = 0;
      this.timer    = 0;
    }
  }

  update(dt) {
    if (!this.current) return;

    const anim = this.animations[this.current];
    if (!anim.image.complete) return;          // not loaded yet

    this.timer += dt * 1000;
    if (this.timer > anim.speed) {
      this.timer = 0;
      this.frameIdx = (this.frameIdx + 1) % anim.frames.length;
    }
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x  world-space left
   * @param {number} y  world-space top
   * @param {boolean} [flipX=false] draw mirrored (for left-facing)
   */
  draw(ctx, x, y, flipX = false) {
    if (!this.current) return;
    const anim  = this.animations[this.current];
    if (!anim.image.complete) return;

    const index = anim.frames[this.frameIdx];
    const col   = index % anim.cols();
    const row   = Math.floor(index / anim.cols());
    const sx    = col * anim.frameW;
    const sy    = row * anim.frameH;

    const dw    = anim.frameW * this.scale;
    const dh    = anim.frameH * this.scale;

    ctx.save();
    if (flipX) {
      ctx.translate(x + dw, y);
      ctx.scale(-1, 1);
      x = 0;
      y = 0;
    }
    ctx.drawImage(anim.image, sx, sy, anim.frameW, anim.frameH, x, y, dw, dh);
    ctx.restore();
  }

  /* ---- used by Time-Travel ----------------------------------- */
  cloneState() {
    return { current: this.current, frameIdx: this.frameIdx, timer: this.timer };
  }
  restoreState(s) {
    this.current  = s.current;
    this.frameIdx = s.frameIdx;
    this.timer    = s.timer;
  }

  /* -------------- helpers ------------------- */
  loadImage(src) {
    if (this.cache[src]) return this.cache[src];
    const img = new Image();
    img.src   = src;
    this.cache[src] = img;
    return img;
  }
}