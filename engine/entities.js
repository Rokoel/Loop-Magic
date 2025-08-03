import GameObject from "./GameObject.js";
import MultiSprite from "./MultiSprite.js";
import Sprite from "./Sprite.js";
import { createRandomTiledCanvas } from "./RandomTileCanvas.js";
import { PLATFORM_TEXTURES }       from "./textureLoader.js";
import { applyImpulse, applyForce } from "./ForceUtils.js";
import Vector2D from "./Vector2D.js";

/* --- preload one or many textures once ----------------------- */

// --- Custom Game Object Classes ---

export class Player extends GameObject {
    constructor(x, y) {
        super(x, y, 16*4, 32*4, "cyan");
        this.id = "player"; // Unique ID for time travel
        this.isMovable = true;
        this.mass = 50;
        this.friction = 0.5;
        this.jumpForce = 700;
        this.maxSpeed   = 300;  // px/s   – horizontal top speed
        this.moveForce  = 500000; // N      – how hard we push each frame
        this.isGrounded = false;
        this.facingLeft = false;

        const sheet = new MultiSprite({
        idle : { src: "assets/player_idle.png",
                w: 16, h: 32, frames:[0, 1], speed: 1000 },
        run  : { src: "assets/player_run.png",
                w: 16, h: 32, frames:[0, 1], speed: 200 },
        jump : { src: "assets/player_jump.png",
                w: 16, h: 32, frames:[2], speed: 1000 }
        }, 4);

        sheet.setAnimation("idle");
        this.attachSprite(sheet);
    }

    update(deltaTime, gameObjects, input) {
        // Horizontal movement
        let moveDirection = 0;
        let isIdle = true;
        if (input.isKeyDown("a") || input.isKeyDown("arrowleft")) {
            moveDirection = -1;
            this.sprite.setAnimation("run");
            isIdle = false;
            this.facingLeft = true;
        } else if (input.isKeyDown("d") || input.isKeyDown("arrowright")) {
            moveDirection = 1;
            this.sprite.setAnimation("run");
            isIdle = false;
            this.facingLeft = false;
        }

        if (moveDirection !== 0) {
            const v  = this.velocity.x;
            const s  = Math.sign(v);

            /* push only if we haven’t reached maxSpeed in that direction */
            if (Math.abs(v) < this.maxSpeed || s !== moveDirection) {
                applyForce(this, moveDirection * this.moveForce, 0);
            }
        }

        if ((input.isKeyDown("w") || input.isKeyDown("arrowup")) && this.isGrounded) {
            this.velocity.y = -this.jumpForce;
            this.sprite.setAnimation("jump");
            this.isGrounded = false;
            isIdle = false;
        }
        if (isIdle && this.isGrounded) {
            this.sprite.setAnimation("idle");
        }
        if (this.sprite) this.sprite.update(deltaTime);
    }

    draw(ctx, camera) {
        this.sprite.draw(ctx, this.position.x, this.position.y, this.facingLeft);
    }
}

export class Platform extends GameObject {
    constructor(x, y, width, height, isOneWay = false) {
        super(x, y, width, height, "#4CAF50");
        this.isMovable = false;
        this.isOneWay = isOneWay;
        this._canvas = createRandomTiledCanvas(
            width, height,
            PLATFORM_TEXTURES,
            32*4,                       // smallest tile size 16 px
            32*4                        // largest tile size 16 px
        );
    }
    draw(ctx /*, camera */) {
        ctx.drawImage(this._canvas, this.position.x, this.position.y);
    }
}

class TexturedPlatform extends GameObject {
    constructor(x, y, width, height, textureSrc) {
        super(x, y, width, height, "#4CAF50");
        this.isMovable = false;
        this.texture = new Sprite(textureSrc, width, height, {
            idle: { frames: [0], speed: 1000 }
        }, 4);
        this.texture.setAnimation("idle");
    }
    update(deltaTime, gameObjects, input) {
        if (this.texture) this.texture.update(deltaTime);
    }
    draw(ctx, camera) {
        const offsetX = this.position.x - camera.position.x;
        const offsetY = this.position.y - camera.position.y;
        this.texture.draw(ctx, offsetX, offsetY);
    }
}

export class Box extends GameObject {
    /**
     * A movable box that can be pushed, stacked, and used to push other objects.
     * @param {number} x - The initial x-coordinate.
     * @param {number} y - The initial y-coordinate.
     * @param {number} width - The width of the box.
     * @param {number} height - The height of the box.
     * @param {number} [mass=2] - The mass of the box (higher mass makes it harder to push).
     * @param {number} [friction=0.1] - The friction coefficient (higher for better stacking stability).
     * @param {string} [color='#8B4513'] - The color of the box for debugging.
     */
    constructor(x, y, width, height, mass = 2, friction = 0.1, color = "#8B4513") {
        super(x, y, width, height, color);
        this.id = `box_${Math.random().toString(36).substr(2, 9)}`; // Unique ID for time travel
        this.isMovable = true;
        this.mass = mass;
        this.friction = friction;

        this.sprite = new Sprite("assets/box.png", 16, 16, {
            idle: { frames: [0], speed: 1000 }
        }, 8);
        this.sprite.setAnimation("idle");
    }

    update(deltaTime, gameObjects, input) {
        if (this.sprite) this.sprite.update(deltaTime);
    }

    // No custom update logic needed; physics handles movement via forces and collisions
}