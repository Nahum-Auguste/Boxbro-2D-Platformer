import camera from "../../camera.js";
import CollisionArea from "../../collision/collision-area.js";
import Draw from "../../draw.js";
import mouse from "../../mouse.js";
import Drawing from "../drawing.js";
import GuiObject from "./gui-object.js";


export default class GuiButton extends GuiObject{
    /**@type {GuiButton[]} */
    static #entity_list = [];

    #idx;
    #id;

    /**@type {Drawing} */
    base_drawing;

    /**@type {Drawing} */
    drawing;

    /**@type {Drawing} */
    hovered_drawing;

    /**@type {Drawing} */
    //held_drawing;

    /**@type {Drawing} */
    clicked_drawing;

    
    /**@type {CollisionArea} */
    collision_area;

    hovered = false;
    clicked = false;
    held = false;


    name="";

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {CollisionArea} collision_area 
     * @param {Drawing} drawing 
     */
    constructor(x=0,y=0,collision_area,drawing,name="") {
        super();
        const class_name = GuiButton;
        const class_nickname = "gui_b";
        class_name.#entity_list.push(this);
        this.#idx = class_name.#entity_list.length-1;
        this.#id = class_nickname + this.#idx;

        this.x = x;
        this.y = y;
        this.collision_area = collision_area;
        this.base_drawing = drawing.get_copy();
        this.drawing = drawing.get_copy();
        this.name = name;
    }

    get_id() {
        return this.#id;
    }

    loop() {
        this.fix_points();
        this.set_status();
        if (this.hovered) this.on_hover();
        if (this.clicked) this.on_click();
    }


    fix_points() {
        const z = camera.zoom;
        const zf = 1/z;
        this.collision_area.offset_points.forEach((p,i,arr)=>{
            const bp = this.collision_area.base_offset_points[i];
            p.x = bp.x * zf;
            p.y = bp.y * zf;
        });
        if (this.drawing) {
            this.drawing.offset_points.forEach((p,i,arr)=>{
                const bp = this.drawing.base_offset_points[i];
                p.x = bp.x * zf;
                p.y = bp.y * zf;
            });
            this.drawing.layers.forEach(l=>{
                const drawing = l;

                drawing.offset_points.forEach((p,i,arr)=>{
                    const bp = drawing.base_offset_points[i];
                    p.x = bp.x * zf;
                    p.y = bp.y * zf;
                });
            })
        }
    }

    draw(offx=0,offy=0) {
        const z = camera.zoom;
        const zf = 1/z;
        const x = (this.x*zf + offx);
        const y = (this.y*zf + offy);

        if ((this.clicked || this.clicked_display_lifetime) && this.clicked_drawing) {
            this.drawing = this.clicked_drawing;
        }
        else if (this.hovered && this.hovered_drawing) {
            this.drawing = this.hovered_drawing;
        }
        else {
            this.drawing = this.base_drawing;
        }

        this.drawing.draw(x,y);
        this.collision_area.x = x;
        this.collision_area.y = y;
    }

    handle_debug_mode() {
        const z = camera.zoom;
        const zf = 1/z;

        this.collision_area.draw();
        const mp = this.collision_area.get_midpoint();
        Draw.text(this.name,mp.x+.5*zf,mp.y+1*zf,11*zf);
        Draw.text(this.name,mp.x,mp.y,10*zf,"white");
    }

    set_status() {
        //set hovered if mouse is unoccupied and collision is met
        if (!mouse.hovered && this.collision_area.is_point_colliding(mouse.x,mouse.y)) {
            mouse.hovered = this;
        }

        //release mouse if no hover collision and set as hovered in mouse
        if (mouse.hovered==this && !this.collision_area.is_point_colliding(mouse.x,mouse.y)) {
            mouse.hovered=null;
        }

        this.hovered = mouse.hovered==this;

        this.clicked = mouse.clicked == this;

        this.held = mouse.holding(this);
    }

    on_hover() {
        if (!this.hovered) {return;}
  
    }

    on_click() {
        if (!this.clicked) {return;}

    }
}