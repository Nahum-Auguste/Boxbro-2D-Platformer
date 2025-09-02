import Mesh from "./mesh.js";
import Vertex from "./vertex.js";
import Vector from "./vector.js";

export default class Geometry {

    static generateSquareMesh(x,y,w,h,alignment="topleft") {
        if (alignment=="center") {
            x-=w/2;
            y-=h/2;
        }
        const v1 = new Vertex(x,y);
        const v2 = new Vertex(x+w,y);
        const v3 = new Vertex(x+w,y+h);
        const v4 = new Vertex(x,y+h);
        return new Mesh([v1,v2,v3,v4]);
    }

    static generateVector() {
        return new Vector();
    }

    static isPointBelowLine(px,py,x1,y1,x2,y2,range=Infinity) {
        let p1 = {
            x:x1,
            y:y1
        }
        let p2 = {
            x:x2,
            y:y2
        }
        if (p2.x<p1.x) {
            const temp = p1;
            p1 = p2;
            p2 = temp;
        }

        let dy = (p2.y-p1.y);
        let dx = p2.x-p1.x;
        let m = dy/dx;
        let b = Math.min(y1,y2);

        let y = py;
        let x = (px-p1.x);

        if (dy<0) {
            x = px-p2.x;
        }

        if (px>=p1.x && px<=p2.x) {
            if ((y>=(m*(x))+(b)) && (y<=(m*(x))+(b+range))) {
                return true;
            }
        }
        
        return false;
    }

    static isPointAboveLine(px,py,x1,y1,x2,y2,range=Infinity) {
        let p1 = {
            x:x1,
            y:y1
        }
        let p2 = {
            x:x2,
            y:y2
        }
        if (p2.x<p1.x) {
            const temp = p1;
            p1 = p2;
            p2 = temp;
        }

        let dy = (p2.y-p1.y);
        let dx = p2.x-p1.x;
        let m = dy/dx;
        let b = Math.min(y1,y2);

        let y = py;
        let x = (px-p1.x);

        if (dy<0) {
            x = px-p2.x;
        }

        //console.log(p2.y);
        

        if (px>=p1.x && px<=p2.x) {
            if ((y<=(m*(x))+(b)) && (y>=(m*(x))+(b-range))) {
                return true;
            }
        }
        
        return false;
    }

}