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
    coffx=0;
    coffy=0;
    /**@type {CollisionArea} */
    collision_area;
    
    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {CollisionArea} collision_area 
     */
    constructor(x,y,collision_area) {
        this.class_name.#entity_list.push(this);
        this.#idx = this.class_name.#entity_list.length-1;
        this.#id = this.class_nickname + this.#idx;


        this.x = x;
        this.y = y;
        this.collision_area = collision_area;
        this.coffx = collision_area.x - this.x;
        this.coffy = collision_area.y - this.y;
    }

    physics() {
        this.collision_area.x = this.x + this.coffx;
        this.collision_area.y = this.y + this.coffy;
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

        if (mouse.mode=="move" || mouse.mode=="delete") {
            if (mouse.hovered==this) {
                this.collision_area.draw_on_hover();
            }

            //Draw.line(this.x,this.y,this.collision_area.x,this.collision_area.y);
            if (this.collision_area.is_point_colliding(mouse.x,mouse.y) && mouse.hovered==null) {
                mouse.hovered = this;
            }

            if (mouse.hovered==this && !this.collision_area.is_point_colliding(mouse.x,mouse.y)) {
                mouse.hovered=null;
            }

            if (mouse.holding(this)) {
                this.collision_area.draw_on_hold();
                mouse.move_obj(this);
                //mouse.move_obj(this.collision_area);
            }
        }
    }

    static get_entity_list() {
        return Body.#entity_list;
    }

    get_id() {
        return this.#id;
    }
}