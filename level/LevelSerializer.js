/* LevelSerializer.js
 * Converts the current scene to / from a plain JSON file.
 */
export function exportLevel(objects) {
  const out = { player: null, platforms: [], boxes: [] };

  for (const o of objects) {
    const base = {
      x: o.position.x,
      y: o.position.y,
      w: o.size.width,
      h: o.size.height,
    };

    if (o.id === "player") out.player = base;
    else if (o.isMovable)  // Box
      out.boxes.push({ ...base, mass: o.mass, friction: o.friction });
    else                   // Platform
      out.platforms.push({ ...base, oneWay: !!o.isOneWay });
  }
  return JSON.stringify(out, null, 2);
}

/* ------------------------------------------------------ */
export function importLevel(data, engine, classes) {
    const { Player, Platform, Box } = classes;
    engine.gameObjects.length = 0;           // clear

    var player = new Player(data.player.x, data.player.y);
    if (data.player) engine.addGameObject(player);

    for (const p of data.platforms ?? [])
        engine.addGameObject(
        new Platform(p.x, p.y, p.w, p.h, p.oneWay)
    );

    for (const b of data.boxes ?? [])
        engine.addGameObject(
        new Box(b.x, b.y, b.w, b.h, b.mass, b.friction)
    );

    return player;
}