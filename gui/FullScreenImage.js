// /gui/FullScreenImage.js
export default class FullScreenImage {
    /**
     * @param {string|HTMLImageElement|ImageBitmap} srcOrImg
     * @param {function} onDone - called when user continues
     */
    constructor(srcOrImg, onDone = null) {
        this.onDone = onDone;
        this.active = true;

        // Create overlay
        this.overlay = document.createElement("div");
        this.overlay.id = "fs-image-overlay";
        Object.assign(this.overlay.style, {
            position: "fixed",
            left: 0, top: 0, width: "100vw", height: "100vh",
            background: "#000",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
        });

        // Image
        this.img = document.createElement("img");
        this.img.style.maxWidth = "100vw";
        this.img.style.maxHeight = "100vh";
        this.img.style.objectFit = "contain";
        this.overlay.appendChild(this.img);

        // Hint
        const hint = document.createElement("div");
        hint.textContent = "Press SPACE/ENTER to continue, or ESC for menu";
        hint.style.color = "#fff";
        hint.style.font = "20px monospace";
        hint.style.marginTop = "2em";
        this.overlay.appendChild(hint);

        document.body.appendChild(this.overlay);

        // Load image
        if (typeof srcOrImg === "string") {
            this.img.src = srcOrImg;
        } else if (srcOrImg instanceof HTMLImageElement || srcOrImg instanceof ImageBitmap) {
            this.img.src = srcOrImg.src || "";
            if (srcOrImg instanceof ImageBitmap) {
                // Convert ImageBitmap to data URL
                const c = document.createElement("canvas");
                c.width = srcOrImg.width;
                c.height = srcOrImg.height;
                c.getContext("2d").drawImage(srcOrImg, 0, 0);
                this.img.src = c.toDataURL();
            }
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
        this.overlay.remove();
        if (this.onDone) this.onDone();
    }
}