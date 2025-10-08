import Draw from "../draw.js";

export default class Point {
    x;
    y;
    /**@type {Point[]} */
    static #entity_list = [];

    #idx;
    #id;

    base_color="rgba(252, 252, 252, 0.9)";
    color=this.base_color;
    base_size=3;
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
    draw() {
        Draw.point(this.x,this.y,3);
    }

    get_id() {
        return this.#id;
    }
}