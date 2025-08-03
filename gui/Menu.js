export default class Menu {
    constructor({ onBegin, onMusicToggle, musicOn = false }) {
        this.onBegin = onBegin;
        this.onMusicToggle = onMusicToggle;
        this.musicOn = musicOn;
        this._build();
    }

    _build() {
        // Remove any existing menu
        const old = document.getElementById("main-menu");
        if (old) old.remove();

        // Create menu container
        const menu = document.createElement("div");
        menu.id = "main-menu";
        menu.style.position = "fixed";
        menu.style.left = "0";
        menu.style.top = "0";
        menu.style.width = "100vw";
        menu.style.height = "100vh";
        menu.style.background = "rgba(0,0,0,0.7)";
        menu.style.display = "flex";
        menu.style.flexDirection = "column";
        menu.style.justifyContent = "center";
        menu.style.alignItems = "center";
        menu.style.zIndex = "1000";

        // Title
        const title = document.createElement("h1");
        title.textContent = "The Mageless Mage";
        title.style.color = "#fff";
        menu.appendChild(title);

        // Begin Story button
        const beginBtn = document.createElement("button");
        beginBtn.textContent = "Begin Story";
        beginBtn.style.fontSize = "2em";
        beginBtn.onclick = () => {
            this.hide();
            this.onBegin && this.onBegin();
        };
        menu.appendChild(beginBtn);

        // Restart Scene button
        const restartBtn = document.createElement("button");
        restartBtn.textContent = "Restart Scene";
        restartBtn.style.marginTop = "1em";
        restartBtn.onclick = () => {
            this.hide();
            window.dispatchEvent(new CustomEvent("scene:restart"));
        };
        menu.appendChild(restartBtn);

        // Music toggle button
        this.musicBtn = document.createElement("button");
        this.musicBtn.textContent = this.musicOn ? "Music: On" : "Music: Off";
        this.musicBtn.style.marginTop = "1em";
        this.musicBtn.onclick = () => {
            this.musicOn = !this.musicOn;
            this.musicBtn.textContent = this.musicOn ? "Music: On" : "Music: Off";
            this.onMusicToggle && this.onMusicToggle(this.musicOn);
        };
        menu.appendChild(this.musicBtn);

        document.body.appendChild(menu);
    }

    hide() {
        const menu = document.getElementById("main-menu");
        if (menu) menu.remove();
    }

    show() {
        this._build();
    }
}