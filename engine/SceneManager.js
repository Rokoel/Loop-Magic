/*  Simple registrar / dispatcher driven by CustomEvents.        */
export default class SceneManager {
  constructor(engine) {
    this.engine  = engine;
    this.scenes  = new Map();
    this.current = null;

    window.addEventListener("scene:change",  e => this.change(e.detail));
  }

  register(name, scene) { this.scenes.set(name, scene); }

  async change(name) {
    if (!this.scenes.has(name)) {
      console.warn("Scene not found:", name);
      return;
    }
    /* ----- clean up old scene -------------------------------- */
    if (this.current?.cleanup) await this.current.cleanup(this.engine);

    /* clear engine state (objects, backgrounds, time scale …)   */
    this.engine.resetWorld();

    /* ----- init new one -------------------------------------- */
    this.current = this.scenes.get(name);
    await this.current.init?.(this.engine);

    window.dispatchEvent(
      new CustomEvent("scene:ready", { detail: name })
    );
  }

  tick(dt) { this.current?.tick?.(dt, this.engine); }
}