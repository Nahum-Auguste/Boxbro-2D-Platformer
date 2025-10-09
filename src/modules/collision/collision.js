import Draw from "../draw.js";
import Point from "../geometry/point.js";


export default class Collision {
    
    static point_with_point(x1,y1,x2,y2,radius=1) {
        const dx = x2-x1;
        const dy = y2-y1;
        return (dx*dx + dy*dy <= (radius*radius));
    }

    static is_point_above_line(x,y,x1,y1,x2,y2) {
        const debug = false;
        const lx1 = Math.min(x1,x2);
        const lx2 = Math.max(x1,x2);
        const ly1 = x1<=x2? y1 : y2;
        const ly2 = x1<=x2? y2 : y1;

        if (debug) {
            Draw.line(x1,y1,x2,y2);
            Draw.point(lx1,ly1,3,"lime");
            Draw.point(lx2,ly2,3,"red");
            Draw.point(x1,y1-80,3,"orange");
            Draw.point(x2,y2-80,3,"orange");

            Draw.point(x,y,3);
        }

        const rx = x-lx1;
        const dy = ly2-ly1;
        const dx = lx2-lx1;
        const slope = dy/dx;
        const ry = rx * slope + ly1;

        if (x>=lx1 && x<=lx2) {
            if (debug) Draw.point(x,ry,3,"teal");

            if (y<=ry) {
                return true;
            }
        }

        return false;
    }

    static is_point_below_line(x,y,x1,y1,x2,y2) {
        const debug = false;
        const lx1 = Math.min(x1,x2);
        const lx2 = Math.max(x1,x2);
        const ly1 = x1<=x2? y1 : y2;
        const ly2 = x1<=x2? y2 : y1;

        if (debug) {
            Draw.line(x1,y1,x2,y2);
            Draw.point(lx1,ly1,3,"lime");
            Draw.point(lx2,ly2,3,"red");
            Draw.point(x1,y1+80,3,"orange");
            Draw.point(x2,y2+80,3,"orange");

            Draw.point(x,y,3);
        }

        const rx = x-lx1;
        const dy = ly2-ly1;
        const dx = lx2-lx1;
        const slope = dy/dx;
        const ry = rx * slope + ly1;

        if (x>=lx1 && x<=lx2) {
            if (debug) Draw.point(x,ry,3,"teal");

            if (y>=ry) {
                return true;
            }
        }

        return false;
    }

    static is_point_to_left_of_line(x,y,x1,y1,x2,y2) {
        const debug = false;
        const ly1 = Math.min(y1,y2);
        const ly2 = Math.max(y1,y2);
        const lx1 = y1<=y2? x1 : x2;
        const lx2 = y1<=y2? x2 : x1;

        if (debug) {
            Draw.line(x1,y1,x2,y2);
            Draw.point(lx1,ly1,3,"lime");
            Draw.point(lx2,ly2,3,"red");
            Draw.point(x1-80,y1,3,"orange");
            Draw.point(x2-80,y2,3,"orange");

            Draw.point(x,y,3);
        }

        const ry = y-ly1;
        const dy = ly2-ly1;
        const dx = lx2-lx1;
        const slope = dx/dy;
        const rx = ry * slope + lx1;

        if (y>=ly1 && y<=ly2) {
            if (debug) Draw.point(rx,y,3,"teal");

            if (x<=rx) {
                return true;
            }
        }

        return false;
    }

    static is_point_to_right_of_line(x,y,x1,y1,x2,y2) {
        const debug = false;
        const ly1 = Math.min(y1,y2);
        const ly2 = Math.max(y1,y2);
        const lx1 = y1<=y2? x1 : x2;
        const lx2 = y1<=y2? x2 : x1;

        if (debug) {
            Draw.line(x1,y1,x2,y2);
            Draw.point(lx1,ly1,3,"lime");
            Draw.point(lx2,ly2,3,"red");
            Draw.point(x1+80,y1,3,"orange");
            Draw.point(x2+80,y2,3,"orange");

            Draw.point(x,y,3);
        }

        const ry = y-ly1;
        const dy = ly2-ly1;
        const dx = lx2-lx1;
        const slope = dx/dy;
        const rx = ry * slope + lx1;

        if (y>=ly1 && y<=ly2) {
            if (debug) Draw.point(rx,y,3,"teal");

            if (x>=rx) {
                return true;
            }
        }

        return false;
    }

    static get_lines_intersection(x1,y1,x2,y2,x3,y3,x4,y4) {
        //NOTE, COPIED FROM STACK OVERFLOW
        const debug = !true;

        // Check if none of the lines are of length 0
        if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
            return false
        }

        let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

        // Lines are parallel
        if (denominator === 0) {
            return false
        }

        let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
        let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

        // is the intersection along the segments
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return false
        }

        // Return a object with the x and y coordinates of the intersection
        let x = x1 + ua * (x2 - x1)
        let y = y1 + ua * (y2 - y1)

        if (debug) {
            Draw.point(x,y,3,"blue green")
        }

        return new Point(x,y);
    }

}