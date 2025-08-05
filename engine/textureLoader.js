export const LIGHT_ROCK_TEXTURES = await Promise.all(
  ["../assets/rock_tile.png", ]
  .map(async src => createImageBitmap(await fetch(src).then(r => r.blob())))
);

export const PLATFORM_TEXTURES = await Promise.all(
  ["../assets/light_rock.png", ]
  .map(async src => createImageBitmap(await fetch(src).then(r => r.blob())))
);

export const RED_PLATFORM_TEXTURES = await Promise.all(
  ["../assets/red_rock_tile.png", ]
  .map(async src => createImageBitmap(await fetch(src).then(r => r.blob())))
);

export const SKY = await Promise.all(
  ["../assets/lighter_sky.png", "../assets/darker_sky.png"]
  .map(async src => createImageBitmap(await fetch(src).then(r => r.blob())))
);