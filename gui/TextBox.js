// /gui/TextBox.js
export default class TextBox {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {string} font - e.g. "24px monospace"
     */
    constructor(canvas, font = "32px monospace") {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.font = font;
        this.active = false;
        this.text = "";
        this.visibleText = "";
        this.letterDelay = 18; // ms per letter
        this.timer = 0;
        this.index = 0;
        this.onDone = null;
        this.skipHint = "Press SPACE or ENTER to continue";
        this.blockInput = true;
        this._boundKey = this._onKey.bind(this);
    }

    show(text, onDone = null) {
        this.text = text;
        this.visibleText = "";
        this.index = 0;
        this.timer = 0;
        this.active = true;
        this.onDone = onDone;
        window.addEventListener("keydown", this._boundKey);
    }

    update(dt) {
        if (!this.active) return;
        if (this.index < this.text.length) {
            this.timer += dt * 1000; // dt in seconds
            if (this.timer >= this.letterDelay) {
                this.visibleText += this.text[this.index];
                this.index++;
                this.timer = 0;
            }
        }
    }

    hide() {
        this.active = false;
        window.removeEventListener("keydown", this._boundKey);
        if (this.onDone) this.onDone();
    }

    _onKey(e) {
        if (!this.active) return;
        if (e.key === "Escape") {
            this.hide();
            window.dispatchEvent(new CustomEvent("show:menu"));
        }
        if (e.key === " " || e.key === "Enter") {
            if (this.visibleText.length < this.text.length) {
                // Instantly show all text
                this.visibleText = this.text;
                this.index = this.text.length;
            } else {
                this.hide();
            }
        }
    }

    _draw() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const blockH = 120;
        ctx.save();
        // Black semi-transparent block
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, h - blockH, w, blockH);
        ctx.globalAlpha = 1.0;

        // Text
        ctx.font = this.font;
        ctx.fillStyle = "#fff";
        ctx.textBaseline = "top";
        ctx.textAlign = "left";
        const margin = 32;
        this._wrapText(ctx, this.visibleText, margin, h - blockH + margin, w - margin * 2, 32);

        // Skip hint
        ctx.font = "16px monospace";
        ctx.fillStyle = "#aaa";
        ctx.textAlign = "right";
        ctx.fillText(this.skipHint, w - margin, h - margin);

        ctx.restore();
    }

    _wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }
}