import Point from "./point.js"
import Line from "./line.js";
import Vertex from "./vertex.js";
import Edge from "./edge.js";
import EdgeSet from "./edgeSet.js";
import Mesh from "./mesh.js";

export default class Geometry {
    /**@type {Point} */
    static Point = Point;

    /**@type {Line} */
    static Line = Line;

    /**@type {Vertex} */
    static Vertex = Vertex;

    /**@type {Edge} */
    static Edge = Edge;

    /**@type {EdgeSet} */
    static EdgeSet = EdgeSet;

    /**@type {Mesh} */
    static Mesh = Mesh;

    static generate_rect_vertices(x,y,w,h,origin_type="top_left") {
        let xoffset = 0;
        let yoffset = 0;
        switch(origin_type.toLowerCase()) {
            case "center":
                xoffset = w/2;
                yoffset = y/2;
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

    static generate_rect_edgeset(x,y,w,h,origin_type="top_left") {
        return new EdgeSet(this.generate_rect_vertices(x,y,w,h,origin_type));
    }

    static generate_rect_mesh(x,y,w,h,origin_type="top_left") {
        return new Mesh(this.generate_rect_vertices(x,y,w,h,origin_type));
    }
}