import Draw from "../draw.js";
import Edge from "./edge.js";

export default class Vertex {
    static #created_count = 0;
    #idx;
    #id;
    #nickname;

    x;
    y;
    /**@type {Edge} */
    left_edge;
    /**@type {Edge} */
    right_edge;

    constructor (x,y) {
        this.#idx = Vertex.#created_count;
        this.#id = Vertex.name + ":" + this.#idx;
        this.#nickname = "v" + this.#idx; 
        Vertex.#created_count++;
        this.x = x;
        this.y = y;
    }

    static get_created_count() {
        return Vertex.#created_count;
    }

    draw(size,color) {
        Draw.point(this.x,this.y,size,color);
    }

    draw_extra(options={}) {
        options.x = this.x;
        options.y = this.y;
        Draw.point_extra(options);
    }

    draw_id(options={}) {
        if (options.nickname==false) {
            Draw.text({x:this.x,y:this.y,text:this.#id,centered:true});
        }
        else{
            Draw.text({x:this.x,y:this.y,text:this.#nickname,centered:true});
        }
    }
}