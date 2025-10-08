import Draw from "../draw.js";


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
}