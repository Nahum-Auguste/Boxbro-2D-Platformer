import EdgeSet from "./edgeSet.js";



export default class Mesh extends EdgeSet {
static #created_count = 0;
#idx;
#id;
#nickname;

    constructor (vertices) {
        super(vertices);
        this.#idx = Mesh.#created_count;
        this.#id = Mesh.name + ":" + this.#idx;
        this.#nickname = "m" + this.#idx; 
        Mesh.#created_count++;
    }

    static get_created_count() {
        return Mesh.#created_count;
    }

    get_id() {
        return this.#id;
    }

    get_nickname() {
        return this.#nickname;
    }

    construct_edges() {
        super.construct_edges();
        this.format_edges();
    }

    format_edges() {
        this.edges.forEach(e=>{
            const v1 = e.v1;
            const v2 = e.v2;
            if (v1.x<v2.x) {
                e.facing = "down";
            }
            else if (v1.x>v2.x) {
                e.facing = "up";
            }
            else {
                if (v1.y<=v2.y) {
                    e.facing = "left";
                }
                else {
                    e.facing = "right";
                }
            }
        })
    }

    handle_debug_mode(){
        super.handle_debug_mode();
        this.format_edges();
    }
}