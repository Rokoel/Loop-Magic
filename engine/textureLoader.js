/**
 * Loads one or more images and returns an array of HTMLImageElements.
 * Always safe for itch.io and all browsers.
 * @param {string|string[]} textures - Path or array of paths.
 * @returns {Promise<HTMLImageElement[]>}
 */
async function returnTexture(textures) {
  const sources = Array.isArray(textures) ? textures : [textures];
  return Promise.all(
    sources.map(
      src =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        })
    )
  );
}

/**
 * Loads a single image for use with BG_MODE.IMAGE.
 * Returns a Promise that resolves to an HTMLImageElement.
 * @param {string} src - Path to the image file.
 * @returns {Promise<HTMLImageElement>}
 */
export async function loadBGImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Exported textures
export const LIGHT_ROCK_TEXTURES   = await returnTexture("assets/rock_tile.png");
export const PLATFORM_TEXTURES     = await returnTexture("assets/light_rock.png");
export const RED_PLATFORM_TEXTURES = await returnTexture("assets/red_rock_tile.png");

// Example: multiple sky variants
export const SKY = await returnTexture([
  "assets/lighter_sky.png",
  "assets/darker_sky.png"
]);

export const MAGE_CITY = await loadBGImage("assets/mage_city.png");