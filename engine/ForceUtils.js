import Vector2D from "./Vector2D.js";

/**
 * applyForce
 * ----------
 * Adds a (continuous) force to a single GameObject for the current frame.
 *
 * @param {GameObject} obj              the object that should accelerate
 * @param {Vector2D|number} fx_or_vec   either a Vector2D or the x-component
 * @param {number} [fy]                 y-component (omit when first arg is vec)
 *
 * Usage examples
 *   applyForce(player, new Vector2D(0, -500));     // straight up
 *   applyForce(box, 200, 0);                       // push right
 *   applyForce(enemy, dir.normalize().scale(800)); // along arbitrary dir
 *
 * The force is accumulated inside `obj.forces`; Physics.update()
 * will turn it into acceleration:  a = F / m  and integrate it over Δt.
 */
export function applyForce(obj, fx_or_vec, fy = null) {
  const f = fy === null
    ? fx_or_vec             // first arg already Vector2D
    : new Vector2D(fx_or_vec, fy);

  // the GameObject base class already exposes applyForce()
  obj.applyForce(f);
}

/**
 * applyImpulse
 * ------------
 * Instant velocity change in Newton-seconds (Δv = J / m).
 * Useful for explosions, jumps, recoil, etc.
 */
export function applyImpulse(obj, ix_or_vec, iy = null) {
  const J = iy === null
    ? ix_or_vec
    : new Vector2D(ix_or_vec, iy);

  // v_new = v + J / m
  obj.velocity = obj.velocity.add(J.scale(1 / obj.mass));
}