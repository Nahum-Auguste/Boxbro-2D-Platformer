import Edge from "./edge.js";
import Vertex from "./vertex.js";
import mouse from "../peripherals/mouse.js";
import Collision from "../collision/collision.js";

export default class EdgeSet {
    static #created_count = 0;
    #id;
    /**@type {Edge[]} */
    edges = [];
    /**@type {Vertex[]} */
    vertices = [];

    vertex_color = "rgba(200, 200, 200, 1)"

    /**@param {Vertex[]} vertices  */
    constructor (vertices) {
        this.#id = EdgeSet.name + ":" + EdgeSet.#created_count; 
        EdgeSet.#created_count++;
        this.vertices = [...vertices];
        this.construct_edges();
    }

    static get_created_count() {
        return EdgeSet.#created_count;
    }

    get_id() {
        return this.#id;
    }

    get_height() {
        return this.get_lowest_vertex().y - this.get_highest_vertex().y;
    }

    get_width() {
        return this.get_rightmost_vertex().x - this.get_leftmost_vertex().x;
    }

    get_leftmost_vertex() {
        let r = this.vertices[0];
        this.vertices.forEach(v=>{
            if (v.x<r.x) {
                r=v;
            }
        })
        return r;
    }

    get_rightmost_vertex() {
        let r = this.vertices[0];
        this.vertices.forEach(v=>{
            if (v.x>r.x) {
                r=v;
            }
        })
        return r;
    }

    get_highest_vertex() {
        let r = this.vertices[0];
        this.vertices.forEach(v=>{
            if (v.y<r.y) {
                r=v;
            }
        })
        return r;
    }

    get_lowest_vertex() {
        let r = this.vertices[0];
        this.vertices.forEach(v=>{
            if (v.y>r.y) {
                r=v;
            }
        })
        return r;
    }

    get_lowest_edge() {
        const lv = this.get_lowest_vertex();
        const pre = lv.left_edge;
        const next = lv.right_edge;
        
        return pre.v1.y>next.v2.y? pre : next;
    }

    get_midx() {
        return this.get_rightmost_vertex().x-(this.get_width()/2);
    }

    get_midy() {
        return this.get_lowest_vertex().y-(this.get_height()/2);
    }

    construct_edges() {
        for (let i=0; i<this.vertices.length; i++) {
            const v1 = this.vertices[i];
            const v2 = this.vertices[(i+1)%this.vertices.length];
            const cur = new Edge(v1,v2);
            this.edges[i]=cur;
        }
        this.connect_edges();
    }

    connect_edges() {
        for (let i=0; i<this.edges.length; i++) {
            const cur = this.edges[i];
            const next = this.edges[(i+1)%this.edges.length];
            cur.next = next;
            next.pre = cur;
            cur.v1.right_edge = cur;
            cur.v2.left_edge = cur;
            cur.v2.right_edge = cur.next;
        }
    }

    draw(options={}) {
        if (!("edges" in options) || options.edges) {
            this.edges.forEach(e=>{
                e.draw();
            });
        }
        if (!("vertices" in options) || options.vertices) {
            this.vertices.forEach(v=>{
                v.draw_extra({color:this.vertex_color,size:options.vertex_size,border:true});
            });
        }
    }

    draw_ids(options={}) {
        if (options.nickname==false) {
            options.vertex_nickname = false;
            options.edge_nickname = false;
        }

        if (options.vertices!=false && options.vertex_names!=false) {
            this.vertices.forEach(v=>{
                v.draw_id({nickname:options.vertex_nickname});
            });
        }
        if (options.edges!=false && options.edge_names!=false) {
            this.edges.forEach(e=>{
                e.draw_id({nickname:options.edge_nickname});
            });
        }
    }

    handle_debug_mode(options={}) {
        if (!options.vertex_size) {
            options.vertex_size = 1.5;
        }
        if (!options.vertex_hover_color) {
            options.vertex_hover_color = "rgba(255, 90, 65, 1)";
        }
        if (!options.vertex_held_color) {
            options.vertex_held_color = "rgba(50, 255, 159, 1)";
        }
        this.draw(options);
        this.draw_ids(options);
        
        
        const vert_range = options.vertex_size+3;
        const vert_hover_size = options.vertex_size+1;
        const vert_hover_color=options.vertex_hover_color;
        const vert_held_color=options.vertex_held_color;
        this.vertices.forEach(v=>{
            
            if (mouse.is_holding(v)!=-1) {
                v.draw_extra({size:vert_hover_size,color:vert_held_color,border:true});
                mouse.move_object(v);
            }
            else if (mouse.held_obj_data.length==0 && Collision.is_point_within_circle(mouse.x,mouse.y,v.x,v.y,vert_range)) {
                v.draw_extra({size:vert_hover_size,color:vert_hover_color,border:true});
                if (mouse.down) {
                    mouse.hold(v);
                }
            }
        })
    }

    print() {
        this.print_vertices();
        this.print_edges();
        console.log(this);
    }

    print_edges() {
        this.edges.forEach(e=>{
            console.log(e);
        });
    }

    print_vertices() {
        this.vertices.forEach(v=>{
            console.log(v);
        })
    }

}
