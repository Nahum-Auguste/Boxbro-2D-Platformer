import Point from "./point.js";
import Draw from "../draw.js";


export default class Line {
    static #created_count = 0;
    static #point_size = 2;
    #id;
    x1;
    y1;
    x2;
    y2;

    /** @type {Point} */
    p1;
    /** @type {Point} */
    p2;

    constructor (options={},x1=undefined,y1=undefined,x2=undefined,y2=undefined) {
        this.#id = Line.name + ":" + Line.#created_count; 
        Line.#created_count++;

        if (x1) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            this.p1 = new Point(this.x1,this.y1);
            this.p2 = new Point(this.x2,this.y2);
        }
        else {
            if (("p1" in options) && ("p2" in options)) {
                this.p1 = new Point(options.p1.x,options.p1.y);
                this.p2 = new Point(options.p2.x,options.p2.y);
                this.x1 = this.p1.x;
                this.y1 = this.p1.y;
                this.x2 = this.p2.x;
                this.y2 = this.p2.y;
            }
            else {
                this.x1 = options.x1;
                this.y1 = options.y1;
                this.x2 = options.x2;
                this.y2 = options.y2;
                this.p1 = new Point(this.x1,this.y1);
                this.p2 = new Point(this.x2,this.y2);
            }
        }

        if ("ordered" in options && options.ordered == true) {
            const minx = Math.min(this.x1,this.x2);
            const maxx = Math.max(this.x1,this.x2);
            const ty1 = this.y1;
            const ty2 =this.y2;

            //if initially right to left, switch y values.
            this.y1 = this.x1>this.x2? ty2 : ty1;
            this.y2 = this.x1>this.x2? ty1 : ty2;

            this.x1 = minx;
            this.x2 = maxx;
            
            this.p1.x = this.x1;
            this.p1.y = this.y1;
            this.p2.x = this.x2;
            this.p2.y = this.y2;
        }
    }

    static get_created_count() {
        return Line.#created_count;
    }

    get_id() {
        return this.#id;
    }

    ordered(function_of_x=false) {
        if (function_of_x) {
            const y1 = Math.min(this.y1,this.y2);
            const y2 = Math.max(this.y1,this.y2);
            const x1 = y1<=y2 ? this.x1 : this.x2;
            const x2 = y1<=y2 ? this.x2 : this.x1;
            return new Line({},x1,y1,x2,y2);
        }

        return new Line({p1:this.p1,p2:this.p2,ordered:true});
    }

    draw(width=1,color="black") {
        Draw.line(this.x1,this.y1,this.x2,this.y2,width,color);
        this.p2.draw_extra({color:"red",border:true,size:Line.#point_size});
        this.p1.draw_extra({color:"lime",border:true,size:Line.#point_size}); 
    }

    draw_extra(options={}) {
        options.x1 = this.x1;
        options.y1 = this.y1;
        options.x2 = this.x2;
        options.y2 = this.y2;
        Draw.line_extra(options);
        this.p2.draw_extra({color:"red",border:true,size:Line.#point_size});
        this.p1.draw_extra({color:"lime",border:true,size:Line.#point_size});
    }

    /**
     * 
     * @param {Line} line 
     * @returns 
     */
    intersects(line,get_casts=false) {
        const debug = true;

        if (debug) {
            this.draw();
            line.draw();
        }

        const l1 = this.ordered();
        const l2 = line.ordered();

        
        const cast1 = l2.point_cast(l1.x1,l1.y1);
        const cast2 = l2.point_cast(l1.x2,l1.y2);
        if (cast1) {
            cast1.draw_extra({color:"yellow",border:true});
        }
        if (cast2) {
            cast2.draw_extra({color:"yellow",border:true});
        }

        const cast3 = l1.point_cast(l2.x1,l2.y1);
        const cast4 = l1.point_cast(l2.x2,l2.y2);
        if (cast3) {
            cast3.draw_extra({color:"cyan",border:true});
        }
        if (cast4) {
            cast4.draw_extra({color:"cyan",border:true});
        }
        
        let result = false;

        if (!result && cast1 && cast2) {
            if ((l1.y1<=cast1.y && l1.y2>=cast2.y) || (l1.y1>=cast1.y && l1.y2<=cast2.y)) {
                //console.log("both self casts");
                
                result = true;
            }
        }
        if (!result && cast1 && cast4) {
            if ((l1.y1<=cast1.y && l2.y2<=cast4.y) || (l1.y1>=cast1.y && l2.y2>=cast4.y)) {
                //console.log("mixed casts1");
                
                result = true;
            }
        }
        if (!result && cast2 && cast3) {
            if ((l1.y2<=cast2.y && l2.y1<=cast3.y) || (l1.y2>=cast2.y && l2.y1>=cast3.y)) {
                //console.log("mixed casts2");
                result = true;
            }
        }
        if (!result && cast3 && cast4) {
            if ((l2.y1<=cast3.y && l2.y2>=cast4.y) || (l2.y1>=cast3.y && l2.y2<=cast4.y)) {
                //console.log("both other casts");
                result = true;
            }
        }

        if (result && get_casts) {
            return {self_casts:[cast1,cast2],other_casts:[cast3,cast3]};
        }

        return result;
        
    }

    point_cast(px,py) {
        const debug = !true;

        if (debug) {
            this.draw();
        }

        const line = this.ordered();
        const x1 = line.x1;
        const y1 = line.y1;
        const x2 = line.x2;
        const y2 = line.y2;
        const dx = x2-x1;
        const dy = y2-y1;
        const slope = dy/dx;
        const rx = px-x1;
        const y = slope*rx + y1;

        const point = new Point(px,y);

        if (px<x1 || px >x2 || y==undefined) {
            return undefined;
        }

        if (debug) {
            point.draw_extra({border:true,color:"pink"})
        }

        return point;
    }


}