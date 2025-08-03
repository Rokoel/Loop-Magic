export default class Music {
    constructor(src, volume = 0.3) {
        this.audio = new Audio(src);
        this.audio.loop = true;
        this.audio.volume = volume;
        this.enabled = true;
        this.audio.autoplay = false;
        this.audio.preload = "auto";
    }

    play() {
        if (!this.enabled) return;
        this.audio.currentTime = 0;
        this.audio.play();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    setEnabled(on) {
        this.enabled = on;
        if (on) {
            this.play();
        } else {
            this.stop();
        }
    }
}