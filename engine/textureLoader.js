async function returnTexture(textures) {
  if (! Array.isArray(textures)) {
    return await Promise.all([textures, ].map(async src => createImageBitmap(await fetch(src).then(r => r.blob()))));
  }
  return await Promise.all(textures.map(async src => createImageBitmap(await fetch(src).then(r => r.blob()))));
}

export const LIGHT_ROCK_TEXTURES = await returnTexture("../assets/rock_tile.png");

export const PLATFORM_TEXTURES = await returnTexture("../assets/light_rock.png");

export const RED_PLATFORM_TEXTURES = await returnTexture("../assets/red_rock_tile.png");

export const SKY = await returnTexture(["../assets/lighter_sky.png", "../assets/darker_sky.png"]);