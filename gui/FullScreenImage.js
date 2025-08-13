export default class FullScreenImage {
    /**
     * @param {string|HTMLImageElement|ImageBitmap} srcOrImg
     * @param {function} onDone - called when user continues
     */
    constructor(srcOrImg, onDone = null) {
        this.onDone = onDone;
        this.active = true;
        this.image = null;

        if (typeof srcOrImg === "string") {
            this.image = new Image();
            this.image.src = srcOrImg;
        } else if (srcOrImg instanceof HTMLImageElement) {
            this.image = srcOrImg;
        } else if (srcOrImg instanceof ImageBitmap) {
            // Convert ImageBitmap to HTMLImageElement
            const c = document.createElement("canvas");
            c.width = srcOrImg.width;
            c.height = srcOrImg.height;
            c.getContext("2d").drawImage(srcOrImg, 0, 0);
            this.image = new Image();
            this.image.src = c.toDataURL();
        }

        this._onKey = this._onKey.bind(this);
        window.addEventListener("keydown", this._onKey);
    }

    _onKey(e) {
        if (!this.active) return;
        if (e.key === " " || e.key === "Enter") {
            this.close();
        }
        if (e.key === "Escape") {
            this.close();
            window.dispatchEvent(new CustomEvent("show:menu"));
        }
    }

    close() {
        this.active = false;
        window.removeEventListener("keydown", this._onKey);
        if (this.onDone) this.onDone();
    }

    draw(ctx, canvasWidth, canvasHeight) {
        if (!this.active || !this.image) return;
        ctx.save();
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(
            this.image,
            0, 0, this.image.width, this.image.height,
            0, 0, canvasWidth, canvasHeight
        );
        ctx.fillStyle = "#fff";
        ctx.font = "20px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Press SPACE/ENTER to continue, or ESC for menu", canvasWidth / 2, canvasHeight - 40);
        ctx.restore();
    }
}