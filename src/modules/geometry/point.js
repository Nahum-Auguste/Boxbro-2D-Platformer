import Draw from "../draw.js";
import Utils from "../utils.js";

export default class Point {
    x;
    y;
    /**@type {Point[]} */
    static #entity_list = [];

    #idx;
    #id;

    base_color="rgba(252, 252, 252, 0.9)";
    color=this.base_color;
    base_size=2;
    size = this.base_size;
    constructor (x,y) {
        const class_name = Point;
        const class_nickname = "p";
        class_name.#entity_list.push(this);
        this.#idx = class_name.#entity_list.length-1;
        this.#id = class_nickname + this.#idx;

        this.x=x;
        this.y=y;

    }
    draw(offx=0,offy=0) {
        const x = this.x + offx;
        const y = this.y + offy;
        const border_width = Utils.clamp(1,this.size-1.5,Infinity);
        Draw.point(x,y,this.size,"black",false,border_width);
        Draw.point(x,y,this.size,this.color);
        Draw.text(this.#id,x+5,y+10,8);
    }

    get_id() {
        return this.#id;
    }
}