import Collision, { CollisionArea } from "../../collision/collision.js";
import Geometry from "../../geometry/geometry.js";
import Vector from "../../geometry/vector.js";
import mouse from "../../peripherals/mouse.js";
import Drawing from "../../visuals/drawing.js";
import Sprite from "../../visuals/sprite.js";
import Entity from "../entity.js";

export default class Body extends Entity {
    static #created_count = 0;
    /**@type {Body[]} */
    static #list = [];
    #idx;
    #id;
    #nickname;
    collision_area;

    /**@type {Drawing} */
    drawing;

    /**@type {Sprite} */
    sprite;

    /**
     * 
     * @param {CollisionArea} collision_area 
     */
    constructor (x,y,collision_area) {
        super(x,y);
        this.#idx = Body.#created_count;
        this.#id = Body.name + ":" + this.#idx;
        Body.#created_count++;
        Body.#list.push(this);
        this.#nickname = "B" + this.#idx; 
        this.collision_area = collision_area;
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

    draw() {
        if (this.drawing) {
            this.drawing.draw(this.x,this.y);
        }
        if (this.sprite) {
            this.sprite.draw(this.x,this.y);
        }
    }

    draw_collision_area(){
        this.collision_area.draw();
    }

    is_colliding() {
        for (let i=0; i<Body.get_body_list().length; i++) {
            const b = Body.get_body_list()[i];
            if (b==this) continue;
            if (this.is_colliding_with(b)) return true;
        }
        return false;
    }

    is_colliding_with(obj) {
        const result = this.collision_area.is_colliding_with(obj);

        return (result);
    }

    

    handle_debug_mode(options={
            vertex_size:1.5,
            vertex_hover_color:"rgba(255, 90, 65, 1)",
            vertex_held_color:"rgba(50, 255, 159, 1)"
        }) 
    {
        let held = false;
        if (!this.collision_area) {return;}
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
        this.collision_area.handle_debug_mode(options);
        super.handle_debug_mode();
    }

    physics() {
        
    }

    move_to(x,y) {
        const pastx = this.x;
        const pasty = this.y;
        super.move_to(x,y);
        const vertices = this.collision_area.vertices;
        vertices.forEach(v=>{
            v.x = x + (v.x-pastx);
            v.y = y + (v.y-pasty);
        });
    }


}