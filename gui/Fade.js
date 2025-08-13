export function drawFadeOverlay(ctx, w, h, fadeAlpha = 1, color = "#000") {
    ctx.save();
    ctx.globalAlpha = fadeAlpha;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
}