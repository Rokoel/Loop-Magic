export default class HUD {
    constructor(engine, abilityManager) {
        this.engine = engine;
        this.abilityManager = abilityManager;
    }

    draw(ctx) {
        ctx.save();
        ctx.font = "20px monospace";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        let y = 10;
        for (const [key, ab] of Object.entries(this.abilityManager.getAll())) {
            if (ab.max === 0 || ab.max === Infinity) continue;
            ctx.fillText(`${ab.label}: ${ab.uses}/${ab.max}`, 10, y);
            y += 28;
        }
        ctx.restore();
    }
}