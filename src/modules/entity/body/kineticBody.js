import Vector from "../../geometry/vector.js";
import CollisionArea from "../../area/collisionArea.js";
import Sprite from "../../visuals/sprite.js";
import Body from "./body.js";

export default class KineticBody extends Body {
    movementVector = new Vector();
    debugEnabled=false;

    /**
     * @param {CollisionArea} collisionArea 
     */
    constructor(x,y,collisionArea) {
        super(x,y,collisionArea);
    }

    /**
     * @param {Sprite} sprite 
     */

    move(dx,dy) {
        this.movementVector.x = dx;
        this.movementVector.y = dy;
        
        this.movementVector.normalize();
        
        dx = this.movementVector.x;
        dy = this.movementVector.y;
        this.x+=dx;
        this.y+=dy;
        this.collisionArea.move(dx,dy);
        this.drawings.forEach(d=>{
            d.move(dx,dy);
        });
    }
}