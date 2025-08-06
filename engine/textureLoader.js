async function returnTexture(textures) {
  if (! Array.isArray(textures)) {
    return await Promise.all([textures, ].map(async src => createImageBitmap(await fetch(src).then(r => r.blob()))));
  }
  return await Promise.all(textures.map(async src => createImageBitmap(await fetch(src).then(r => r.blob()))));
}

/**
 * Loads an image for use with BG_MODE.IMAGE.
 * Returns a Promise that resolves to an ImageBitmap (preferred) or HTMLImageElement.
 * @param {string} src - Path to the image file.
 * @param {boolean} [asBitmap=true] - If true, returns ImageBitmap; else HTMLImageElement.
 * @returns {Promise<ImageBitmap|HTMLImageElement>}
 */
export async function loadBGImage(src, asBitmap = true) {
    if (asBitmap && 'createImageBitmap' in window) {
        const blob = await fetch(src).then(r => r.blob());
        return await createImageBitmap(blob);
    } else {
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
}

export const LIGHT_ROCK_TEXTURES = await returnTexture("../assets/rock_tile.png");

export const PLATFORM_TEXTURES = await returnTexture("../assets/light_rock.png");

export const RED_PLATFORM_TEXTURES = await returnTexture("../assets/red_rock_tile.png");

export const SKY = await returnTexture(["../assets/lighter_sky.png", "../assets/darker_sky.png"]);

export const MAGE_CITY = await loadBGImage("../assets/mage_city.png");