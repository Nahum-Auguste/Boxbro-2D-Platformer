import Point from "./point.js"
import Line from "./line.js";
import Vertex from "./vertex.js";
import Edge from "./edge.js";
import EdgeSet from "./edgeSet.js";

export default class Geometry {
    static Point = Point;
    static Line = Line;
    static Vertex = Vertex;
    static Edge = Edge;
    static EdgeSet = EdgeSet;

    static generate_rect_edgeset(x,y,w,h,origin_type="top_left") {
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
        return new EdgeSet([v1,v2,v3,v4]);
    }
}