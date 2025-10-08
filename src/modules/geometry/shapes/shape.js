import Point from "../point.js";

export default class Shape {
    /**@type {Point[]} */
    offset_points = [];

    get_offset_points_copy() {
        const copy = [];

        this.offset_points.forEach(p=>{
            copy.push(new Point(p.x,p.y));
        });

        return copy;
    }
}