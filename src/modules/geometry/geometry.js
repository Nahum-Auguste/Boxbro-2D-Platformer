import Point from "./point.js";

export default class Geometry {

    /**
     * 
     * @param {Array} values 
     * @returns 
     */
    static generate_points(values) {
        const points = [];

        values.forEach(a=>{
            points.push(new Point(a[0],a[1]));
        });

        return points;
    }

    static get_line_orientation(x1,y1,x2,y2) {
        if (x2>x1) {
            return "below";
        }
        if (x2<x1) {
            return "above";
        }
        if (y1<=y2 && x1==x2) {
            return "left";
        }
        if (y1>=y2 && x1==x2) {
            return "right";
        }
    }
}