import * as Draw from "../draw.js";
import Mouse from "../peripherals/mouse.js";
import * as Utils from "../utils.js";
import Point from "./point.js";

/**
 * @property {Number} made
 * @property {Number} count
 * @property {Number} x
 * @property {Number} y
 * @property {String} id
 * @property {String} color
 */
export default class Vertex {
    static #madeCount = 0;
    static #existsCount = 0;
    x;
    y;
    id;
    baseColor = "rgba(96, 154, 255, 1)";
    hoverColor = "rgba(255, 76, 48, 1)";
    color = this.baseColor;
    opacity = .8;

    constructor(x,y) {
        Vertex.#incrementMadeCount();
        this.x = x;
        this.y = y;
        //console.log(Vertex.#madeCount);
        
        this.id = ":v" + (Vertex.#madeCount-1);
    }

    static getMadeCount() {
        return this.#madeCount;
    }

    static getExistsCount() {
        return this.#existsCount;
    }

    static #incrementMadeCount() {
        this.#madeCount++;
        this.#incrementExistsCount();
    }

    static #incrementExistsCount() {
        this.#existsCount++;
    }

    static #decrementExistsCount() {
        this.#existsCount--;
    }

    handleDebugMode() {
        this.debug_draw();
        const m = Mouse.getPosition();
        if (Utils.isPointsIntersecting(this.x,this.y,m.x,m.y,5)) {
            this.color = this.hoverColor;
            
            if (Mouse.held.length==0 && Mouse.down) {
                Mouse.held.push(this);
            }
        }
        else {
            this.color = this.baseColor;
        }

        if (Mouse.held.includes(this)) {
            Mouse.moveObject(this);
        }
    }

    debug_draw(size=3,opacity=this.opacity) {
        Draw.circle(this.x,this.y,size,"black",true,opacity);
        Draw.circle(this.x,this.y,size-1,this.color,true,opacity);
        Draw.text(this.x,this.y,this.id,9);
    }

    handleDeletion() {
        Vertex.#decrementExistsCount();
    }

    /**
     * 
     * @returns {Point}
     */
    to_point() {
        return new Point(this.x,this.y)    
    }

    distance_to(v) {
        const dx = this.x-v.x;
        const dy = this.y-v.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

}