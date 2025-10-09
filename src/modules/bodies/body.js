import CollisionArea from "../collision/collision-area.js";
import Draw from "../draw.js";
import mouse from "../mouse.js";

export default class Body {
    class_name = Body;
    /**@type {Body[]} */
    static #entity_list = [];
    class_nickname = "B";

    #idx;
    #id;
    x;
    y;
    /**@type {CollisionArea} */
    collision_area;
    
    constructor(x,y,collision_area) {
        this.class_name.#entity_list.push(this);
        this.#idx = this.class_name.#entity_list.length-1;
        this.#id = this.class_nickname + this.#idx;


        this.x = x;
        this.y = y;
        this.collision_area = collision_area;
    }

    physics() {

    }

    handle_debug_mode() {
        if (this.collision_area) {
            this.collision_area.handle_debug_mode();
        }
        Draw.point(this.x,this.y,3,"black",false);
        Draw.point(this.x,this.y,3,"pink");
        Draw.text(this.get_id(),this.x,this.y-5);

        //Draw.line(this.x,this.y,this.collision_area.x,this.collision_area.y);
        if (mouse.holding(this.collision_area)) {
            mouse.move_obj(this);
        }
    }

    static get_entity_list() {
        return Body.#entity_list;
    }

    get_id() {
        return this.#id;
    }
}