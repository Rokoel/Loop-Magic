import { LIGHT_ROCK_TEXTURES } from "../engine/textureLoader.js";
import BackgroundRect, { BG_MODE } from "../engine/BackgroundRect.js";

/* editor/LevelEditor.js
 * Mouse-driven GUI to place / move / resize objects.
 * Physics is never stepped – we only call engine.draw().
 */
import { exportLevel, importLevel } from "./LevelSerializer.js";

export default class LevelEditor {
  constructor(engine, classes) {
    this.engine   = engine;
    this.classes  = classes;          // { Player, Platform, Box }

    /* ------------- UI state --------------------------- */
    this.tool       = "select";       // 'select' | 'platform' | 'box' | 'player'
    this.sel        = null;           // selected GameObject
    this.dragging   = false;
    this.resizing   = false;
    this.offset     = { x: 0, y: 0 }; // click offset inside obj

    /* ------------- DOM hooks -------------------------- */
    this.canvas = engine.canvas;
    this.ctx    = this.canvas.getContext("2d");
    this.makeToolbar();

    /* ------------- mouse events ----------------------- */
    this.canvas.addEventListener("mousedown",  e => this.onDown(e));
    window.addEventListener ("mousemove",      e => this.onMove(e));
    window.addEventListener ("mouseup",        () => this.stopDrag());
    window.addEventListener ("keydown",        e => {
      if (e.key === "Delete" && this.sel) this.deleteSelected();
    });

    requestAnimationFrame(this.loop.bind(this));
  }

  /* =================================================== */
  /* -----------------   RENDER  ----------------------- */
  loop() {
    this.engine.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.engine.draw();                         // draw current objects
    if (this.sel) this.drawSelection();         // dashed rect + handle
    requestAnimationFrame(this.loop.bind(this));
  }

  drawSelection() {
    const { x, y } = this.sel.position;
    const { width:w, height:h } = this.sel.size;
    this.ctx.save();
    this.ctx.strokeStyle = "#ffff00";
    this.ctx.setLineDash([4, 4]);
    this.ctx.strokeRect(x, y, w, h);
    /* resize handle */
    this.ctx.fillStyle = "#ffff00";
    this.ctx.fillRect(x + w - 4, y + h - 4, 8, 8);
    this.ctx.restore();
  }

  /* =================================================== */
  /* -----------------   MOUSE  ------------------------ */
  canvasPos(evt) {
    const r = this.canvas.getBoundingClientRect();
    return { x: (evt.clientX - r.left), y: (evt.clientY - r.top) };
  }

  objectAt(pt) {
    return [...this.engine.gameObjects]
      .reverse()                     // top-most first
      .find(o =>
        pt.x >= o.position.x &&
        pt.x <= o.position.x + o.size.width &&
        pt.y >= o.position.y &&
        pt.y <= o.position.y + o.size.height
      );
  }

  onDown(evt) {
    const p = this.canvasPos(evt);

    /* ---- check resize handle first ------------------ */
    if (this.sel) {
      const br = {
        x: this.sel.position.x + this.sel.size.width,
        y: this.sel.position.y + this.sel.size.height,
      };
      if (Math.abs(p.x - br.x) < 8 && Math.abs(p.y - br.y) < 8) {
        this.resizing = true;
        return;
      }
    }

    if (this.tool === "select") {
      this.sel = this.objectAt(p) || null;
      if (this.sel) {
        this.dragging = true;
        this.offset.x = p.x - this.sel.position.x;
        this.offset.y = p.y - this.sel.position.y;
      }
    } else {
      /* ---- creating new object ---------------------- */
      const { Platform, Box, Player } = this.classes;
      let obj;
      if (this.tool === "platform")
        obj = new Platform(p.x, p.y, 100, 20);
      else if (this.tool === "box")
        obj = new Box(p.x, p.y, 40, 40);
      else if (this.tool === "player") {
        /* remove old player first */
        this.engine.gameObjects =
          this.engine.gameObjects.filter(o => o.id !== "player");
        obj = new Player(p.x, p.y);
      }
      this.engine.addGameObject(obj);
      this.sel = obj;
      this.tool = "select";
      this.dragging = true;
      this.offset = { x: 0, y: 0 };
    }
  }

  onMove(evt) {
    if (!this.sel) return;
    const p = this.canvasPos(evt);

    if (this.dragging) {
      this.sel.position.x = p.x - this.offset.x;
      this.sel.position.y = p.y - this.offset.y;
    } else if (this.resizing) {
      this.sel.size.width  = Math.max(10, p.x - this.sel.position.x);
      this.sel.size.height = Math.max(10, p.y - this.sel.position.y);
    }
  }

  stopDrag() {
    this.dragging = this.resizing = false;
  }

  deleteSelected() {
    this.engine.gameObjects =
      this.engine.gameObjects.filter(o => o !== this.sel);
    this.sel = null;
  }

  /* =================================================== */
  /* -----------------   TOOLBAR  ---------------------- */
  makeToolbar() {
    const bar = document.createElement("div");
    bar.id = "toolbar";
    bar.innerHTML = `
      <button data-tool="select">Select</button>
      <button data-tool="platform">Platform</button>
      <button data-tool="box">Box</button>
      <button data-tool="player">Player</button>
      &nbsp;|&nbsp;
      <button id="saveBtn">Save</button>
      <input type="file" id="loadInput" style="display:none" accept=".json">
      <button id="loadBtn">Load</button>
    `;
    Object.assign(bar.style, {
      position:"fixed", top:"8px", left:"8px",
      background:"#222", color:"#fff", padding:"4px"
    });
    document.body.appendChild(bar);

    bar.querySelectorAll("[data-tool]").forEach(btn =>
      btn.addEventListener("click", () => {
        this.tool = btn.dataset.tool;
      })
    );

    /* Save */
    bar.querySelector("#saveBtn").addEventListener("click", () => {
      const json = exportLevel(this.engine.gameObjects);
      const blob = new Blob([json], { type:"application/json" });
      const a    = document.createElement("a");
      a.href     = URL.createObjectURL(blob);
      a.download = "level.json";
      a.click();
      URL.revokeObjectURL(a.href);
    });

    /* Load */
    const loadInput = bar.querySelector("#loadInput");
    bar.querySelector("#loadBtn").addEventListener("click", () => loadInput.click());
    loadInput.addEventListener("change", async e => {
      const file = e.target.files[0];
      if (!file) return;

      const json = JSON.parse(await file.text());

      /*  wait for the bitmaps  */
      const player = importLevel(json, this.engine, this.classes);

      /* (optional) in the editor we usually keep the camera static;
        remove this line if you prefer.                          */
      if (player) this.engine.camera.follow(player);
    });
  }
}