import Vector2D from "./Vector2D.js";

/**
 * Manages the physics simulation, including forces, movement,
 * and continuous collision detection.
 */
export default class Physics {
	constructor(worldWidth, worldHeight) {
		this.gravity = new Vector2D(0, 1500); // Stronger gravity for a platformer feel
		this.worldBounds = {
			width: worldWidth,
			height: worldHeight,
		};
	}

	/**
	 * Updates the physics state for all game objects.
	 * @param {Array<GameObject>} objects - The list of all game objects.
	 * @param {number} deltaTime - The time elapsed since the last frame.
	 */
	update(objects, deltaTime) {
		if (deltaTime > 0.1) deltaTime = 0.1; // Prevent spiral of death

		for (const obj of objects) {
			if (!obj.isMovable) continue;

			// Apply forces
			obj.applyForce(this.gravity.scale(obj.mass));

			// Update velocity
			const acceleration = obj.forces.scale(1 / obj.mass);
			obj.velocity = obj.velocity.add(acceleration.scale(deltaTime));

			// Reset forces for the next frame
			obj.forces = new Vector2D(0, 0);

			// Handle collisions and update position
			this.handleCollisions(obj, objects, deltaTime);
		}

		// Resolve resting contacts after all movements (for stable stacking)
		this.resolveRestingContacts(objects, deltaTime);
	}

	/**
	 * Handles collision response between two movable objects (pushing).
	 * @param {GameObject} obj1 - The first movable object.
	 * @param {GameObject} obj2 - The second movable object.
	 * @param {Vector2D} normal - The collision normal.
	 * @param {number} deltaTime - The frame's delta time.
	 */
	handleMovableCollision(obj1, obj2, normal) {
		// Relative velocity along the collision normal
		const relVel = obj1.velocity.subtract(obj2.velocity);
		const separatingVel = relVel.dot(normal);

		if (separatingVel > 0) return; // already moving apart

		const invMass1 = 1 / obj1.mass;
		const invMass2 = 1 / obj2.mass;

		// Perfectly inelastic (no bounce) impulse
		const impulseMag = -separatingVel / (invMass1 + invMass2);
		const impulse = normal.scale(impulseMag);

		obj1.velocity = obj1.velocity.add(impulse.scale(invMass1));
		obj2.velocity = obj2.velocity.subtract(impulse.scale(invMass2));

		/* --------- tangential (friction) impulse ---------- */
		// Skip tangential friction if contact is vertical (player on top of box)
		if (Math.abs(normal.y) < 0.5) {
			const tangent = relVel.subtract(normal.scale(separatingVel)).normalize();
			const maxFriction = impulseMag * obj1.friction * obj2.friction;
			const tangVel = relVel.dot(tangent);
			const frictionMag = Math.max(-maxFriction, Math.min(maxFriction, -tangVel));

			const frictionImpulse = tangent.scale(frictionMag);
			obj1.velocity = obj1.velocity.add(frictionImpulse.scale(invMass1));
			obj2.velocity = obj2.velocity.subtract(frictionImpulse.scale(invMass2));
		}
	}

	/**
	 * Detects and resolves collisions for a single object against all others.
	 * @param {GameObject} obj - The object to check.
	 * @param {Array<GameObject>} allObjects - All objects in the scene.
	 * @param {number} deltaTime - The frame's delta time.
	 */
	handleCollisions(obj, allObjects, deltaTime) {
		obj.isGrounded = false;
		let remainingTime = 1;
		let maxIterations = 5; // Increased for better stack resolution

		// First, handle any existing overlaps by separating objects
		this.separateOverlappingObjects(obj, allObjects);

		while (remainingTime > 0 && maxIterations-- > 0) {
			let earliestCollision = {
				time: 1,
				normal: new Vector2D(0, 0),
				other: null,
			};

			for (const other of allObjects) {
				if (obj === other) continue;

				const sweptResult = this.sweptAABB(obj, other, deltaTime * remainingTime);

				// One-way platform logic
				if (other.isOneWay) {
					const objAABB = obj.getAABB();
					const otherAABB = other.getAABB();
					const epsilon = 5;
					if (
						obj.velocity.y > 0 &&
						sweptResult.normal.y === -1 &&
						objAABB.max.y <= otherAABB.min.y + epsilon
					) {
						// Allow collision (falling onto platform)
					} else {
						continue; // Ignore collision
					}
				}

				if (sweptResult.hit && sweptResult.time < earliestCollision.time) {
					earliestCollision = {
						time: sweptResult.time,
						normal: sweptResult.normal,
						other: other,
					};
				}
			}

			// Move to the point of collision or end of movement
			obj.position.x += obj.velocity.x * deltaTime * remainingTime * earliestCollision.time;
			obj.position.y += obj.velocity.y * deltaTime * remainingTime * earliestCollision.time;

			if (earliestCollision.time < 1) {
				// Handle collision response
				if (earliestCollision.normal.y < -0.5) {
					obj.isGrounded = true;
				}

				// Check if we're colliding with another movable object
				if (earliestCollision.other && earliestCollision.other.isMovable) {
					// Handle movable-to-movable collision (pushing)
					this.handleMovableCollision(obj, earliestCollision.other, earliestCollision.normal, deltaTime);
					
					// Reduce remaining time more aggressively for movable collisions
					remainingTime *= (1 - earliestCollision.time) * 0.5;
				} else {
					// Handle collision with static object (original logic)
					const vn = obj.velocity.x * earliestCollision.normal.x + obj.velocity.y * earliestCollision.normal.y;
					obj.velocity = new Vector2D(
						obj.velocity.x - earliestCollision.normal.x * vn,
						obj.velocity.y - earliestCollision.normal.y * vn
					);
					
					remainingTime *= (1 - earliestCollision.time);
				}
				
				remainingTime = Math.max(remainingTime, 0);
			} else {
				break;
			}
		}
	}

	/**
	 * Resolves resting contacts for stable stacking (counteracts gravity on stacks).
	 * @param {Array<GameObject>} allObjects - All objects in the scene.
	 * @param {number} deltaTime - The frame's delta time.
	 */
	resolveRestingContacts(allObjects) {
		const PEN_TOL = 5;   // positional tolerance (pixels)
		const H_FRICTION = 0.1; // very light horizontal drag when resting

		for (const top of allObjects) {
			if (!top.isMovable) continue;

			for (const bottom of allObjects) {
				if (top === bottom) continue;

				const a = top.getAABB();
				const b = bottom.getAABB();

				// is top sitting (more or less) on bottom?
				const overlapX = Math.min(a.max.x - b.min.x, b.max.x - a.min.x);
				if (overlapX <= 0) continue; // no horizontal overlap

				const penetration = a.max.y - b.min.y;
				if (penetration <= 0 || penetration > PEN_TOL) continue; // either no touch or too deep – the main solver will handle it

				/* --- positional correction -------------------------------- */
				top.position.y -= penetration;      // pop the object up
				top.velocity.y = 0;                 // kill vertical motion
				top.isGrounded = true;              // allow jumping
				if (bottom.isMovable) bottom.isSupport = true; // optional flag you can use elsewhere

				// /* --- minimal horizontal damping so stack does not slide off --- */
				// if (Math.abs(top.velocity.x) < 5) {
				// 	// only damp if object is almost idle (so player input is not cancelled)
				// 	top.velocity.x *= (1 - H_FRICTION);
				// 	if (Math.abs(top.velocity.x) < 0.5) top.velocity.x = 0;
				// }
			}
		}
	}

	/**
	 * Separates overlapping objects by moving them apart.
	 * @param {GameObject} obj - The object to separate.
	 * @param {Array<GameObject>} allObjects - All objects in the scene.
	 */
	separateOverlappingObjects(obj, allObjects) {
		for (const other of allObjects) {
			if (obj === other || !obj.isMovable) continue;

			const box1 = obj.getAABB();
			const box2 = other.getAABB();

			// Check if objects are overlapping
			if (
				box1.max.x > box2.min.x &&
				box1.min.x < box2.max.x &&
				box1.max.y > box2.min.y &&
				box1.min.y < box2.max.y
			) {
				// Skip one-way platforms when moving up through them
				if (other.isOneWay && obj.velocity.y <= 0) {
					continue;
				}

				// Calculate overlap on each axis
				const overlapX = Math.min(box1.max.x - box2.min.x, box2.max.x - box1.min.x);
				const overlapY = Math.min(box1.max.y - box2.min.y, box2.max.y - box1.min.y);

				// Separate along the axis with minimum overlap
				if (overlapX < overlapY) {
					// Separate horizontally
					const centerX1 = box1.min.x + (box1.max.x - box1.min.x) / 2;
					const centerX2 = box2.min.x + (box2.max.x - box2.min.x) / 2;
					const separationDistance = overlapX;
					
					if (centerX1 < centerX2) {
						obj.position.x -= separationDistance;
					} else {
						obj.position.x += separationDistance;
					}
				} else {
					// Separate vertically
					const centerY1 = box1.min.y + (box1.max.y - box1.min.y) / 2;
					const centerY2 = box2.min.y + (box2.max.y - box2.min.y) / 2;
					const separationDistance = overlapY;
					
					if (centerY1 < centerY2) {
						obj.position.y -= separationDistance;
						if (obj.velocity.y > 0) obj.velocity.y = 0;
						obj.isGrounded = true;
					} else {
						obj.position.y += separationDistance;
						if (obj.velocity.y < 0) obj.velocity.y = 0;
					}
				}
			}
		}
	}

	/**
	 * Performs Swept AABB collision detection.
	 * @param {GameObject} obj1 - The moving object.
	 * @param {GameObject} obj2 - The static object (for this check).
	 * @param {number} deltaTime - The frame's delta time.
	 * @returns {{hit: boolean, time: number, normal: Vector2D}} Collision result.
	 */
	sweptAABB(obj1, obj2, deltaTime) {
		const vel = obj1.velocity.scale(deltaTime);
		const box1 = obj1.getAABB();
		const box2 = obj2.getAABB();

		// Broad-phase check: if already overlapping, calculate separation normal
		if (
			box1.max.x > box2.min.x &&
			box1.min.x < box2.max.x &&
			box1.max.y > box2.min.y &&
			box1.min.y < box2.max.y
		) {
			// Calculate overlap on each axis
			const overlapX = Math.min(box1.max.x - box2.min.x, box2.max.x - box1.min.x);
			const overlapY = Math.min(box1.max.y - box2.min.y, box2.max.y - box1.min.y);

			// Find the axis with minimum overlap (shortest separation distance)
			let normal = new Vector2D(0, 0);
			if (overlapX < overlapY) {
				// Separate horizontally
				const centerX1 = box1.min.x + (box1.max.x - box1.min.x) / 2;
				const centerX2 = box2.min.x + (box2.max.x - box2.min.x) / 2;
				normal.x = centerX1 < centerX2 ? -1 : 1;
			} else {
				// Separate vertically
				const centerY1 = box1.min.y + (box1.max.y - box1.min.y) / 2;
				const centerY2 = box2.min.y + (box2.max.y - box2.min.y) / 2;
				normal.y = centerY1 < centerY2 ? -1 : 1;
			}

			return { hit: true, time: 0, normal: normal };
		}

		// Calculate distance to collision and separation on each axis
		let xInvEntry, yInvEntry;
		let xInvExit, yInvExit;

		if (vel.x > 0) {
			xInvEntry = box2.min.x - box1.max.x;
			xInvExit = box2.max.x - box1.min.x;
		} else {
			xInvEntry = box2.max.x - box1.min.x;
			xInvExit = box2.min.x - box1.max.x;
		}

		if (vel.y > 0) {
			yInvEntry = box2.min.y - box1.max.y;
			yInvExit = box2.max.y - box1.min.y;
		} else {
			yInvEntry = box2.max.y - box1.min.y;
			yInvExit = box2.min.y - box1.max.y;
		}

		// Calculate entry and exit times for each axis
		let xEntry, yEntry;
		let xExit, yExit;

		// Handle zero velocity cases properly
		if (vel.x === 0) {
			if (xInvEntry > 0 || xInvExit < 0) {
				// No overlap on X axis and no movement on X axis = no collision possible
				return { hit: false, time: 1, normal: new Vector2D(0, 0) };
			}
			// There is overlap on X axis, so X axis doesn't constrain the collision
			xEntry = -Infinity;
			xExit = Infinity;
		} else {
			xEntry = xInvEntry / vel.x;
			xExit = xInvExit / vel.x;
		}

		if (vel.y === 0) {
			if (yInvEntry > 0 || yInvExit < 0) {
				// No overlap on Y axis and no movement on Y axis = no collision possible
				return { hit: false, time: 1, normal: new Vector2D(0, 0) };
			}
			// There is overlap on Y axis, so Y axis doesn't constrain the collision
			yEntry = -Infinity;
			yExit = Infinity;
		} else {
			yEntry = yInvEntry / vel.y;
			yExit = yInvExit / vel.y;
		}

		const entryTime = Math.max(xEntry, yEntry);
		const exitTime = Math.min(xExit, yExit);

		if (entryTime > exitTime || entryTime > 1 || entryTime < 0) {
			return { hit: false, time: 1, normal: new Vector2D(0, 0) };
		}

		// Calculate normal of collided surface
		let normal = new Vector2D(0, 0);
		if (xEntry > yEntry) {
			normal.x = vel.x > 0 ? -1 : 1;
		} else {
			normal.y = vel.y > 0 ? -1 : 1;
		}
		return { hit: true, time: entryTime, normal: normal };
	}
}