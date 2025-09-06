import Line from "./line.js";
import Vector from "./vector.js";
import * as Draw from "../draw.js";


export default class Point{
    x;
    y;
    constructor(x,y) {
        this.x=x;
        this.y=y;
    }
    /**
     * 
     * @param {Point} point 
     * @returns {Number}
     */
    distanceToPoint(point) {
        let dx = point.x-this.x;
        let dy = point.y-this.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    /**
     * 
     * @param {*} x1 
     * @param {*} y1 
     * @param {*} x2 
     * @param {*} y2 
     * @returns {Point}
     */
    projectionOnLine(x1,y1,x2,y2) {
        const start_x = Math.min(x1,x2);
        const start_y = Math.min(y1,y2);
        const end_x = Math.max(x1,x2);
        const end_y = Math.max(y1,y2);

        const line_vec = new Vector(end_x-start_x,end_y-start_y);
        //Draw.vector(start_x,start_y,line_vec,"green");

        const to_point = new Vector(this.x-start_x,this.y-start_y);
        //Draw.vector(start_x,start_y,to_point,"red");
        const to_proj = line_vec.scale(to_point.dot(line_vec)/Math.pow(line_vec.magnitude(),2));
        //Draw.vector(start_x,start_y,to_proj,"orange");
        return new Point(start_x+to_proj.x,start_y+to_proj.y);
    }
    /**
     * 
     * @param {Line} line 
     * @returns 
     */
    projectionOnGeometricLine(line) {
        //line = line.ordered();
        const start_x = line.x1;
        const start_y = line.y1;
        //const end_x = line.x2;
        //const end_y = line.y2;

        //Draw.line(line.x1,line.y1,line.x2,line.y2);
        const line_vec = line.to_vector();
        //Draw.vector(start_x,start_y,line_vec,"pink");
        const to_point = new Vector(this.x-start_x,this.y-start_y);
        //Draw.vector(start_x,start_y,to_point,"green");
        const to_proj = line_vec.scale(to_point.dot(line_vec)/Math.pow(line_vec.magnitude(),2));
        //Draw.vector(start_x,start_y,to_proj,"yellow");
        //Draw.point(new Point(start_x+to_proj.x,start_y+to_proj.y));
        return new Point(start_x+to_proj.x,start_y+to_proj.y);
    }

    equals(point) {
        return this.x==point.x && this.y==point.y;
    }

    draw(size=2,color="black",opacity=1) {
        Draw.circle(this.x,this.y,size,color);
    }
}