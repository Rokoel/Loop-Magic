export function drawFadeOverlay(ctx, w, h, fadeAlpha = 1, color = "#000") {
    ctx.save();
    const DPR = window.devicePixelRatio || 1;
    ctx.globalAlpha = fadeAlpha;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w / DPR, h / DPR);
    ctx.restore();
}