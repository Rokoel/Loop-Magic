/**
 * Represents a 2D vector with x and y components.
 * Provides methods for common vector operations.
 */
export default class Vector2D {
	/**
	 * @param {number} [x=0] - The x component of the vector.
	 * @param {number} [y=0] - The y component of the vector.
	 */
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Adds another vector to this vector.
	 * @param {Vector2D} other - The vector to add.
	 * @returns {Vector2D} A new vector representing the sum.
	 */
	add(other) {
		return new Vector2D(this.x + other.x, this.y + other.y);
	}

	/**
	 * Subtracts another vector from this vector.
	 * @param {Vector2D} other - The vector to subtract.
	 * @returns {Vector2D} A new vector representing the difference.
	 */
	subtract(other) {
		return new Vector2D(this.x - other.x, this.y - other.y);
	}

	/**
	 * Scales this vector by a scalar value.
	 * @param {number} scalar - The value to scale by.
	 * @returns {Vector2D} A new scaled vector.
	 */
	scale(scalar) {
		return new Vector2D(this.x * scalar, this.y * scalar);
	}

	/**
	 * Calculates the dot product of this vector and another.
	 * @param {Vector2D} other - The other vector.
	 * @returns {number} The dot product.
	 */
	dot(other) {
		return this.x * other.x + this.y * other.y;
	}

	/**
	 * Calculates the magnitude (length) of the vector.
	 * @returns {number} The magnitude of the vector.
	 */
	magnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	/**
	 * Normalizes the vector (makes its length 1).
	 * @returns {Vector2D} A new normalized vector.
	 */
	normalize() {
		const mag = this.magnitude();
		if (mag === 0) {
			return new Vector2D(0, 0);
		}
		return new Vector2D(this.x / mag, this.y / mag);
	}

	/**
	 * Creates a copy of this vector.
	 * @returns {Vector2D} A new Vector2D instance with the same values.
	 */
	clone() {
		return new Vector2D(this.x, this.y);
	}
}