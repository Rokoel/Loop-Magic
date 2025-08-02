/**
 * createRandomTiledCanvas
 * ------------------------------------------------------
 * Draw one bitmap that covers (width × height) completely with
 * randomly-chosen, randomly-rotated square tiles.
 *
 *   minTile … smallest side  (power-of-two, default 16)
 *   maxTile … *largest* side (power-of-two, default ∞)
 */
export function createRandomTiledCanvas(width, height, textures, minTile = 16, maxTile = Number.MAX_SAFE_INTEGER) {
    const c = document.createElement("canvas");
    c.width  = width;
    c.height = height;
    const ctx = c.getContext("2d");
    const DPR = window.devicePixelRatio || 1;
    ctx.scale(DPR, DPR);                     // make 1 unit = 1 CSS pixel

    ctx.imageSmoothingEnabled       = false;
    ctx.webkitImageSmoothingEnabled = false; // Safari
    ctx.msImageSmoothingEnabled     = false; // old Edge

    const pow2LE = n => 1 << (31 - Math.clz32(n));     // floor-pow2

    /* -------- grid in “cells”; cell = minTile px ---------------- */
    const gw = Math.ceil(width  / minTile);
    const gh = Math.ceil(height / minTile);
    const filled = Array.from({ length: gh }, () => new Uint8Array(gw));

    const maxCells = Math.max(1, maxTile >> Math.round(Math.log2(minTile)));

    const randInt = n => Math.floor(Math.random() * n);

    for (let gy = 0; gy < gh; ++gy)
        for (let gx = 0; gx < gw; ++gx)
            if (!filled[gy][gx]) {
                /* --- 1. free rectangle size --------------------------- */
                let freeW = 0;
                while (gx + freeW < gw && !filled[gy][gx + freeW]) freeW++;
                let freeH = 0;
                while (gy + freeH < gh && !filled[gy + freeH].slice(gx, gx + freeW).some(v => v)) freeH++;

                let maxSide = Math.min(freeW, freeH, maxCells);
                maxSide = pow2LE(maxSide);                   // power-of-two ≤ max

                /* --- 2. choose side weight-biased to larger sizes ------ */
                const maxPow = Math.log2(maxSide);
                const minPow = 0;                            // 1 cell = minTile
                const pow    = maxPow - randInt(maxPow - minPow + 1);
                const side   = 1 << pow;                     // in cells

                /* --- 3. mark filled ----------------------------------- */
                for (let y = 0; y < side; ++y)
                filled[gy + y].fill(1, gx, gx + side);

                /* --- 4. draw tile ------------------------------------- */
                const px   = gx * minTile;
                const py   = gy * minTile;
                const size = side * minTile;

                const img  = textures[randInt(textures.length)];
                const rot  = randInt(4);

                ctx.save();
                ctx.translate(px + size / 2, py + size / 2);
                ctx.rotate(rot * Math.PI / 2);
                ctx.drawImage(img, -size / 2, -size / 2, size, size);
                ctx.restore();
            }
    return c;
}