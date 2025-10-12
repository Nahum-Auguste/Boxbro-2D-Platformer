import Draw from "../draw.js";
import Point from "../geometry/point.js";
import Shape from "../geometry/shapes/shape.js";

export default class Drawing {
    /**@type {Point[]} */
    offset_points = [];

    /**@type {Point[]} */
    base_offset_points = [];

    /**@type {Drawing[]} */
    layers = [];

    color;

    /**@type {Shape} */
    shape;

    /**
     * @param {Shape} shape 
     * @param {Drawing[]} drawings 
     */
    constructor(shape,color="black",drawings=[]) {
        this.offset_points = shape.get_offset_points_copy();
        this.base_offset_points = shape.get_offset_points_copy();
        this.layers = [...drawings];
        this.color = color;
        this.shape = shape;
    }

    draw(x,y) {
        this.layers.forEach(d=>{
            d.draw(x,y);
        });
        
        Draw.area(this.offset_points,this.color,x,y);
    }

    get_copy() {
        return new Drawing(this.shape,this.color,this.layers);
    }
}