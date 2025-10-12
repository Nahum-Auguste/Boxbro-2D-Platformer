import CollisionArea from "../collision/collision-area.js";
import Draw from "../draw.js";
import mouse from "../mouse.js";
import Utils from "../utils.js";

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
        const origin_point_size = 3;
        const origin_color = "rgba(178, 197, 255, 1)";
        const border_width = Utils.clamp(.5,origin_point_size-1.5,Infinity);
        Draw.point(this.x,this.y,origin_point_size,origin_color);
        Draw.point(this.x,this.y,origin_point_size,"black",false,border_width);
        Draw.text(this.get_id(),this.x,this.y-5,10);

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