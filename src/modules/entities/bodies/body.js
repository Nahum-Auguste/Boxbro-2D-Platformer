import Collision, { CollisionArea } from "../../collision/collision.js";
import mouse from "../../peripherals/mouse.js";
import Entity from "../entity.js";

export default class Body extends Entity {
    static #created_count = 0;
    static #list = [];
    #idx;
    #id;
    #nickname;
    collision_area;

    /**
     * 
     * @param {CollisionArea} collision_area 
     */
    constructor (x,y,collision_area) {
        super(x,y);
        this.#idx = Body.#created_count;
        this.#id = Body.name + ":" + this.#idx;
        this.#nickname = "B" + this.#idx; 
        Body.#created_count++;
        this.collision_area = collision_area;
        Body.#list.push(this);
    }

    static get_created_count() {
        return Body.#created_count;
    }

    static get_body_list() {
        return Body.#list;
    }

    get_id() {
        return this.#id;
    }

    get_nickname() {
        return this.#nickname;
    }

    draw_collision_area(){
        this.collision_area.draw();
    }

    is_colliding_with(obj) {
        for (let i=0; i<1;//this.collision_area.edges.length;
             i++) {
            const e = this.collision_area.edges[i];
            const l1 = e.to_line();
            for (let j=0; j<obj.collision_area.edges.length;j++) {
                const oe = obj.collision_area.edges[j];
                const l2 = oe.to_line();
                if (l1.intersects(l2)) {
                    console.log(e.get_id(),"collides with",oe.get_id());
                    
                    return true;
                }
            }
        }

        return false;
    }

    

    handle_debug_mode() {
        let held = false;
        if (this.collision_area.is_point_colliding(mouse.x,mouse.y)) {
            
            if (mouse.held_obj_data.length==0 && mouse.down) {
                mouse.hold(this);
            }
        }

        if (mouse.is_holding(this)!=-1) {
            held = true;
        }
        if (held && mouse.down) {
            mouse.move_object(this);
            
            this.collision_area.vertices.forEach(v=>{
                mouse.move_object(v);
            });
        }
        this.collision_area.handle_debug_mode();
        super.handle_debug_mode();
    }


}