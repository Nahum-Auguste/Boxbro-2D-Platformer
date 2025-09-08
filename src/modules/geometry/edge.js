import Vertex from "./vertex.js";
import Draw from "../draw.js";
import Point from "./point.js";
import Line from "./line.js";


export default class Edge {
    static #created_count = 0;
    static start_color = "rgba(72, 255, 117, 1)";
    static end_color = "rgba(255, 160, 72, 1))";
    #idx;
    #id;
    #nickname;
    facing = undefined;
    /**@type {Edge} */
    pre=null;
    /**@type {Edge} */
    next=null;
    

    /** @type {Vertex} */
    v1;
    /** @type {Vertex} */
    v2;

    constructor (v1,v2,options={}) {
        this.#idx = Edge.#created_count;
        this.#id = Edge.name + ":" + this.#idx;
        this.#nickname = "e" + this.#idx; 
        Edge.#created_count++;

        if ("pre" in options) {
            this.pre = options.pre;
        }
        if ("next" in options) {
            this.next = options.next;
        }

        this.v1 = v1;
        this.v2 = v2;

    }

    static get_created_count() {
        return Edge.#created_count;
    }

    get_id() {
        return this.#id;
    }

    get_midpoint() {
        return new Point(Math.min(this.v1.x,this.v2.x)+Math.abs(this.v2.x-this.v1.x)/2,Math.min(this.v1.y,this.v2.y)+Math.abs(this.v2.y-this.v1.y)/2);
    }

    draw(width=1,color="black") {
        Draw.line(this.v1.x,this.v1.y,this.v2.x,this.v2.y,width,color);
        //this.v2.draw_extra({color:Edge.start_color,border:true,size:Edge.#vertex_size});
        //this.v1.draw_extra({color:Edge.end_color,border:true,size:Edge.#vertex_size}); 
    }

    draw_extra(options={}) {
        options.x1 = this.v1.x;
        options.y1 = this.v1.y;
        options.x2 = this.v2.x;
        options.y2 = this.v2.y;
        Draw.line_extra(options);
        //this.v2.draw_extra({color:Edge.start_color,border:true,size:Edge.#vertex_size});
        //this.v1.draw_extra({color:Edge.end_color,border:true,size:Edge.#vertex_size}); 
    }

    draw_id(options={}) {
        if (options.nickname==false) {
            Draw.text({x:this.get_midpoint().x,y:this.get_midpoint().y,text:this.#id,centered:true});
        }
        else{
            Draw.text({x:this.get_midpoint().x,y:this.get_midpoint().y,text:this.#nickname,centered:true});
        }
        if (this.facing) {
            Draw.text({x:this.get_midpoint().x,y:this.get_midpoint().y+10,text:this.facing,centered:true});
        }
    }

    to_line(ordered=false) {
        return new Line({ordered:ordered},this.v1.x,this.v1.y,this.v2.x,this.v2.y);
    }

}