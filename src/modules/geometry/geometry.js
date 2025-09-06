import Mesh from "./mesh.js";
import Vertex from "./vertex.js";
import Vector from "./vector.js";
import Line from "./line.js";
import Point from "./point.js";
import * as Draw from "../draw.js";

export default class Geometry {

    static generateSquareMesh(x,y,w,h,alignment="topleft") {
        if (alignment=="center") {
            x-=w/2;
            y-=h/2;
        }
        const p1 = [x,y];
        const p2 = [x+w,y];
        const p3 = [x+w,y+h];
        const p4 = [x,y+h];
        return new Mesh([p1,p2,p3,p4]);
    }

    static generateVerticies(points) {
        const vertices = [];
        points.forEach(p => {
            vertices.push(new Vertex(p[0],p[1]));
        });

        return vertices;
    }

    static generateVector() {
        return new Vector();
    }

    static isPointBelowLine(px,py,x1,y1,x2,y2) {
        let start_x = Math.min(x1,x2);
        let start_y = x1<x2? y1 : y2;
        let end_x = Math.max(x1,x2);
        let end_y = x1<x2? y2 : y1;
        //Draw.line(start_x,start_y,end_x,end_y);

        if (x1==x2) {
            return (px==x1 && py>=end_y)
        }
        
        //Draw.point(new Point(start_x,start_y),3,"green")

        if (px>=start_x && px<=end_x) {
            const relx = px-start_x;
            const dy = end_y-start_y;
            const dx = end_x-start_x;
            const slope = dy/dx;
            const y = relx*slope;
                
            let pp = new Point(px,y+start_y);
            //Draw.point(pp,7,"red")
            
                //Draw.point(pp,5,"yellow");
                if (py>=pp.y) {
                    return true;
                }
            //}
        }
        
        return false;
    }

    static isPointAboveLine(px,py,x1,y1,x2,y2) {
        let start_x = Math.min(x1,x2);
        let start_y = x1<x2? y1 : y2;
        let end_x = Math.max(x1,x2);
        let end_y = x1<x2? y2 : y1;
        //Draw.line(start_x,start_y,end_x,end_y);

        if (x1==x2) {
            return (px==x1 && py>=end_y)
        }
        
        //Draw.point(new Point(start_x,start_y),3,"green")

        if (px>=start_x && px<=end_x) {
            const relx = px-start_x;
            const dy = end_y-start_y;
            const dx = end_x-start_x;
            const slope = dy/dx;
            const y = relx*slope;
                
            let pp = new Point(px,y+start_y);
            //Draw.point(pp,7,"red")
            
                //Draw.point(pp,5,"yellow");
                if (py<=pp.y) {
                    return true;
                }
            //}
        }
        
        return false;
    }

    /**
     * 
     * @param {*} px 
     * @param {*} py 
     * @param {Line} line 
     * @param {*} range 
     */
    static isPointBelowGeometricLine(px,py,line) {
        
        return this.isPointBelowLine(px,py,line.x1,line.y1,line.x2,line.y2);
    }

    static isPointAboveGeometricLine(px,py,line) {
        
        return this.isPointAboveLine(px,py,line.x1,line.y1,line.x2,line.y2);
    }

    /**
     * 
     * @param {Point} p
     * @param {Line} line 
     */
    static point_umbra_of_line(p,line) {
        //p.draw(3,"orange");
        //line.draw(2,"purple");

        const minx = Math.min(line.x1,line.x2);
        const miny = Math.min(line.y1,line.y2);
        const maxx = Math.max(line.x1,line.x2);
        const maxy = Math.max(line.y1,line.y2);
        const sx = minx;
        const sy = line.x1<=line.x2? line.y1 : line.y2;
        const ex = maxx;
        const ey = line.x1<=line.x2? line.y2 : line.y1;

        //new Point(sx,sy).draw(3,"lime")
        //new Point(ex,ey).draw(3,"pink")

        const to_point = new Vector(p.x-sx,p.y-sy);
        //to_point.draw(sx,sy,"orange");

        const to_line = new Vector(ex-sx,ey-sy);
        //to_line.draw(sx,sy,"red");

        const shadow = to_line.scale(to_point.dot(to_line)/Math.pow(to_line.magnitude(),2));
        //shadow.draw(sx,sy,"blue");

        const umbra = new Point(sx+shadow.x,sy+shadow.y);
        if (umbra.x>=minx && umbra.x<=maxx && umbra.y>= miny && umbra.y<=maxy) {
            //umbra.draw(3,"black");
            return umbra;
        }
        else {
            return new Point();
        }
        
    }

    static point_cast_of_line(p,line) {
        const debug = true;
        

        const minx = Math.min(line.x1,line.x2);
        const miny = Math.min(line.y1,line.y2);
        const maxx = Math.max(line.x1,line.x2);
        const maxy = Math.max(line.y1,line.y2);
        const sx = minx;
        const sy = line.x1<=line.x2? line.y1 : line.y2;
        const ex = maxx;
        const ey = line.x1<=line.x2? line.y2 : line.y1;

        if (debug) {
            p.draw(3,"orange");
            line.draw(2,"purple");
            new Point(sx,sy).draw(3,"lime")
            new Point(ex,ey).draw(3,"pink")
        }
        const dy = ey-sy;
        const dx = ex-sx;
        const slope = dy/dx;
        const relx = p.x-sx;
        let y = relx*slope+sy;

        if (dx==0) {
            y = sy;
        }
        

        const cast = new Point(p.x,y);
        if (cast.x>=minx && cast.x<=maxx) {
            if (debug)
            {    
                Draw.point(cast,2,"black");
                Draw.point(cast,3,"yellow",false);
                Draw.point(cast,4,"black",false);
            }
            return cast;
        }
        else {
            return undefined
        }
        

        


    }

    static normal_of_point_to_line(p,line) {
        const umbra = this.point_umbra_of_line(p,line);
        return new Vector(p.x-umbra.x,p.y-umbra.y);
    }

    static normal_of_line_to_point(line,p) {
        const umbra = this.point_umbra_of_line(p,line);
        return new Vector(umbra.x-p.x,umbra.y-p.y);
    }

    static vertexDistance(v1,v2) {
        const dx = v2.x-v1.x;
        const dy = v2.y-v1.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

}