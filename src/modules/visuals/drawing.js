import Draw from "../draw.js";
import EdgeSet from "../geometry/edgeSet.js";
import Geometry from "../geometry/geometry.js";


export default class Drawing {
    /**@type {EdgeSet[]} */
    layers = [];

    /**@type {EdgeSet} */
    edgeset;

    color;
    x;
    y;

    constructor(x,y,edgeset,color="black",border=false,strokeWidth=1,borderColor="black") {
        this.edgeset = edgeset;
        this.color = color;
        this.border = border;
        this.borderColor = borderColor;
        this.strokeWidth = strokeWidth;
        this.x = x;
        this.y = y;
    }

    draw(x,y) {
        this.layers.forEach(d=>{
            d.draw(x,y);
        });
        this.edgeset.vertices.forEach(v=>{
            v.x += x-this.x;
            v.y += y-this.y;
        });
        Draw.area(Geometry.vertices_to_points(this.edgeset.vertices),this.color);
        if (this.border) {
            this.edgeset.edges.forEach(e=>{
                const l = e.to_line();
                Draw.line(l.x1,l.y1,l.x2,l.y2,this.strokeWidth,this.borderColor)
            });
        }
        this.x = x;
        this.y = y;
    }

}