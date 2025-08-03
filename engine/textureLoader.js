export const LIGHT_ROCK_TEXTURES = await Promise.all(
  ["../assets/rock_tile.png", ]
  .map(async src => createImageBitmap(await fetch(src).then(r => r.blob())))
);

export const PLATFORM_TEXTURES = await Promise.all(
  ["../assets/light_rock.png", ]
  .map(async src => createImageBitmap(await fetch(src).then(r => r.blob())))
);