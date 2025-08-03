export default class TimeController {
  constructor() {
    this.globalScale   = 1;
    this.globalFade    = null;           // {target, dur, t}

    // Map< GameObject , {scale, fadeDur, t, ignoreGlobal} >
    this.locals = new Map();
  }

  /* -------- global ------------------------------------------ */
  setGlobal(scale)              { this.globalScale = scale; }
  slowGlobal(scale, dur = 0)    { this.fadeGlobal(scale, dur); }
  fadeGlobal(target, dur) {
    this.globalFade = { target, dur, t: 0, start: this.globalScale };
  }

  /* -------- local helpers ----------------------------------- */
  _add(obj, scale, dur, ignoreG) {
    this.locals.set(obj, { scale, dur, t: 0, ignoreGlobal: ignoreG });
  }

  slowOnly(objs, scale, dur = 0)   { objs.forEach(o => this._add(o, scale, dur, false)); }
  slowExcept(objs, scale, dur = 0) {
    // set global first, then mark exceptions
    this.fadeGlobal(scale, dur);
    objs.forEach(o => this._add(o, 1, dur, true));
  }

  clear(obj) { this.locals.delete(obj); }

  /* -------- per-frame update -------------------------------- */
  update(dt) {
    /* global fade */
    if (this.globalFade) {
      const f = this.globalFade;
      f.t += dt;
      const k = Math.min(f.t / f.dur, 1);
      this.globalScale = f.start + (f.target - f.start) * k;
      if (k === 1) this.globalFade = null;
    }

    /* locals */
    for (const [obj, st] of this.locals) {
      if (st.dur === 0) continue;
      st.t += dt;
      if (st.t >= st.dur) this.locals.delete(obj);
    }
  }

  /* -------- final scale for object -------------------------- */
  scaleFor(obj) {
    const local = this.locals.get(obj);
    const sLoc  = local ? local.scale : 1;
    const sGlob = (local && local.ignoreGlobal) ? 1 : this.globalScale;
    return sLoc * sGlob;
  }
}