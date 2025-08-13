export function drawVignetteOverlay(ctx, w, h, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const grad = ctx.createRadialGradient(
        w / 2, h / 2, Math.min(w, h) / 4,
        w / 2, h / 2, Math.max(w, h) / 1.1
    );
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
}