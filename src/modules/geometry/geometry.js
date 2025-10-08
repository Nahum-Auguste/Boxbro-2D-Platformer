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
}