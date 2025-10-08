import Geometry from "../geometry.js";
import Shape from "./shape.js";

export default class RectShape extends Shape{

    constructor (w,h) {
        super();
        this.offset_points = Geometry.generate_points([[0,0],[w,0],[w,h],[0,h]]);
    }
}