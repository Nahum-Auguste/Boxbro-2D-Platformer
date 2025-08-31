import * as Collision from "./collision.js";
export * as Collision from "./collision.js";



/**
 * Represents a Player object.
 * @class
 * @property {Number} x
 * @property {Number} y
 * @property {Collision.Boundary} collisionBoundary
 */
export default class Player{
    
    x = null;
    y = null;
    collisionBoundary;
    hasCollision=true;
    mouseColliding=false;
    debugMode=false;

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Collision.Boundary} collisionBoundary 
     */
    constructor(x,y,collisionBoundary) {
        this.x = x;
        this.y = y;
        this.collisionBoundary = collisionBoundary;
    }

    drawCollisionBox() {
        if (this.collisionBoundary==null) {return;}
        this.collisionBoundary.draw();
        this.collisionBoundary.drawArea(1000);
    }

    isMouseColliding(event) {
        this.mouseColliding = this.collisionBoundary.isMouseColliding(event)
        return this.mouseColliding;
    }

    

}

