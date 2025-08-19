export function drawVignetteOverlay(ctx, w, h, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const DPR = window.devicePixelRatio || 1;
    const grad = ctx.createRadialGradient(
        w/DPR / 2, h/DPR / 2, Math.min(w/DPR, h/DPR) / 4,
        w/DPR / 2, h/DPR / 2, Math.max(w/DPR, h/DPR) / 1.1
    );
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w/DPR, h/DPR);
    ctx.restore();
}