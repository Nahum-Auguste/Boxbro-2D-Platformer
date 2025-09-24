import Point from "./point.js"
import Line from "./line.js";
import Vertex from "./vertex.js";
import Edge from "./edge.js";
import EdgeSet from "./edgeSet.js";
import Mesh from "./mesh.js";
import Vector from "./vector.js";

export default class Geometry {

    static Point = Point;

    static Line = Line;

    static Vertex = Vertex;

    static Edge = Edge;

    static EdgeSet = EdgeSet;

    /**@type {Mesh} */
    static Mesh = Mesh;

    static Vector = Vector;

    static vertices_to_point_array(verticies,xoffset=0,yoffset=0) {
        const points = [];

        verticies.forEach(v=>{
            const x = v.x+xoffset;
            const y = v.y+yoffset;
            points.push([x,y]);
        });

        return points;
    }

    static vertices_to_points(verticies,xoffset=0,yoffset=0) {
        const points = [];

        verticies.forEach(v=>{
            const x = v.x+xoffset;
            const y = v.y+yoffset;
            points.push(new Point(x,y));
        });

        return points;
    }

    static generate_vertices(points) {
        const vertices = [];
        points.forEach(p => {
            vertices.push(new Vertex(p[0],p[1]));
        });

        return vertices;
    }

    static generate_rect_vertices(x,y,w,h,origin_type="top_left") {
        let xoffset = 0;
        let yoffset = 0;
        switch(origin_type.toLowerCase()) {
            case "center":
                xoffset = w/2;
                yoffset = h/2;
                break;

        }
        const x1 = x-xoffset;
        const y1 = y-yoffset;
        const x2 = x1+w;
        const y2 = y1;
        const x3 = x1+w;
        const y3 = y1+h;
        const x4 = x1;
        const y4 = y1+h;
        const v1 = new Vertex(x1,y1);
        const v2 = new Vertex(x2,y2);
        const v3 = new Vertex(x3,y3);
        const v4 = new Vertex(x4,y4);
        return [v1,v2,v3,v4];
    }

    static generate_edgeset(points) {
        const vertices = this.generate_vertices(points);
        return new EdgeSet(vertices);
    }

    static generate_mesh(points) {
        const vertices = this.generate_vertices(points);
        return new Mesh(vertices);
    }

    static generate_rect_edgeset(x,y,w,h,origin_type="top_left") {
        return new EdgeSet(this.generate_rect_vertices(x,y,w,h,origin_type));
    }

    static generate_rect_mesh(x,y,w,h,origin_type="top_left") {
        return new Mesh(this.generate_rect_vertices(x,y,w,h,origin_type));
    }

    static point_projection_to_line(options={},x,y,x1,y1,x2,y2) {
        const debug = !true;
        /**@type {Line} */
        let line;
        if (options.line) {
            line = options.line.ordered();
        }
        else {
            line = new Line({},x1,y1,x2,y2).ordered();
        }
        x1 = line.x1;
        y1 = line.y1;
        x2 = line.x2;
        y2 = line.y2;

        let p;
        if (options.point) {
            p = options.point;
        }
        else {
            p = new Point(x,y);
        }
        x = p.x;
        y = p.y;

        const line_vec = new Vector(x2-x1,y2-y1);
        const to_p = new Vector(x-x1,y-y1);
        const comp = line_vec.scaled(line_vec.dot(to_p)/Math.pow(line_vec.magnitude(),2));
        const pp = new Point(x1+comp.x,y1+comp.y);

        if (debug) {
            line.draw();
            line_vec.draw(x1,y1,"purple");
            to_p.draw(x1,y1,"green");
            comp.draw(x1,y1,"pink");
        }

        if (options.constrained && (pp.x>x2 || pp.x<x1 || pp.y<line.ordered(true).y1 || pp.y>line.ordered(true).y2)) {
            return undefined;
        }

        if (pp.x==undefined || isNaN(pp.x) || isNaN(pp.y) || pp.y==undefined) {
            return undefined;
        }
        else {
            if (debug) {
                pp.draw_extra({color:"red",iris:true,border:true});
            }
            return pp;
        }
    }

    static point_normal_to_line(options={},x,y,x1,y1,x2,y2) {
        const debug = !true;

        if (!options.constrained) {
            options.constrained = true;
        }

        const pp = this.point_projection_to_line(options,x,y,x1,y1,x2,y2);

        if (debug) {
            if (pp) {
                pp.draw(2,"red");
            }
        }

        if (pp) {
            const normal = new Vector(x-pp.x,y-pp.y); 

            if (debug) {
                normal.draw(pp.x,pp.y);
            }

            return normal;
        }

        

        return undefined;
    }

    /*

    static point_cast_to_line(options={},x,y,x1,y1,x2,y2){
        const debug = true;

        let line;
        if (options.line) {
            line = options.line.ordered();
        }
        else {
            line = new Line({},x1,y1,x2,y2).ordered();
        }
        x1 = line.x1;
        y1 = line.y1;
        x2 = line.x2;
        y2 = line.y2;

        let p;
        if (options.point) {
            p = options.point;
        }
        else {
            p = new Point(x,y);
        }
        x = p.x;
        y = p.y;

        const rx = x - x1;
        const dx = x2-x1;
        const dy = y2-y1;
        const slope = dy/dx;

        let cy = slope*rx + y1;

        const cast = new Point(x,cy);

        if (debug) {
            line.draw(1,"blue");
            if (cast) {
                cast.draw_extra({iris:true,border:true,color:pink});
            }
        }

    }
    */
}