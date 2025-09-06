import Point from "./point.js";
import Vector from "./vector.js";
import * as Draw from "../draw.js";

export default class Line {
    x1;
    y1;
    x2;
    y2;
    constructor(x1,y1,x2,y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    ordered() {
        const minx = Math.min(this.x1,this.x2);
        const miny = Math.min(this.y1,this.y2);
        const maxx = Math.max(this.x1,this.x2);
        const maxy = Math.max(this.y1,this.y2);
        const sx = minx;
        const sy = this.x1<=this.x2? this.y1 : this.y2;
        const ex = maxx;
        const ey = this.x1<=this.x2? this.y2 : this.y1;

        return new Line(sx,sy,ex,ey);
    }
    to_vector() {
        return new Vector(this.x2-this.x1,this.y2-this.y1);
    }
    draw(width=2,color="black",opacity=1) {
        Draw.line(this.x1,this.y1,this.x2,this.y2,color,width,opacity);
        Draw.circle(this.x1,this.y1,2,"green");
        Draw.circle(this.x2,this.y2,2,"red");
    }
    /**
     * 
     * @param {Line} line 
     */
    intersects(line) {
        const l = line.ordered();
        const l2 = this.ordered()
        const proj1 = new Point(l.x1,l.y1).projectionOnLine(l2);
        const proj2 = new Point(l.x2,l.y2).projectionOnLine(l2);
       // Draw.point(proj1,10,"pink");
        //Draw.point(proj2,10,"pink");
        //Draw.line(proj1.x,proj1.y,proj2.x,proj2.y,"black",5)

        return false;
    }
}