import * as Draw from "../draw.js";

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

    constructor(x,y,name = "") {
        Vertex.#incrementMadeCount();
        this.x = x;
        this.y = y;
        this.id = name + ":v" + Vertex.#madeCount;
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

    draw(size=3,opacity=this.opacity) {
        Draw.circle(this.x,this.y,size,"black",true,opacity);
        Draw.circle(this.x,this.y,size-1,this.color,true,opacity);
        Draw.text(this.x,this.y,this.id,9);
    }

    handleDeletion() {
        Vertex.#decrementExistsCount();
    }

}