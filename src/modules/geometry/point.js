import Draw from "../draw.js";

export default class Point{
    static #created_count = 0;
    #id;

    x;
    y;

    constructor (x,y) {
        this.#id = Point.name + ":" + Point.#created_count;
        Point.#created_count++;
        this.x = x;
        this.y = y;
    }

    static get_created_count() {
        return Point.#created_count;
    }

    draw(size,color) {
        Draw.point(this.x,this.y,size,color);
    }

    draw_extra(options={}) {
        options.x = this.x;
        options.y = this.y;
        Draw.point_extra(options);
    }
}

