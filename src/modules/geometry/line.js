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

    ordered() {
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




}