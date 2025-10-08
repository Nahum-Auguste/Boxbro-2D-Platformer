import Draw from "../draw.js";
import Point from "../geometry/point.js";
import Shape from "../geometry/shapes/shape.js";
import mouse from "../mouse.js";
import Collision from "./collision.js";

export default class CollisionArea {
    /**@type {CollisionArea[]} */
    static #entity_list = [];

    #idx;
    #id;

    x;
    y;
    /**@type {Point[]} */
    offset_points = [];

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {Shape} shape 
     */
    constructor(x,y,shape) {
        const class_name = CollisionArea;
        const class_nickname = "ca";
        class_name.#entity_list.push(this);
        this.#idx = class_name.#entity_list.length-1;
        this.#id = class_nickname + this.#idx;


        this.x = x;
        this.y = y;
        this.offset_points = shape.get_offset_points_copy();
    }

    draw() {
        //Point Parameters
        const point_size = 2.5;
        const origin_color = "rgba(159, 255, 185, 0.9)";
        const line_width = point_size;
        const text_size = 13;
        
        //Draw Offset Points
        this.offset_points.forEach((p,i,a)=>{
            const x = this.x + p.x;
            const y = this.y + p.y;

            const np = a[(i+1)%a.length];
            const nx = this.x + np.x;
            const ny = this.y + np.y;
            Draw.line(x,y,nx,ny,"black",.5);
            Draw.point(x,y,p.size,"black",false,line_width);
            Draw.point(x,y,p.size,p.color);
            Draw.text(i,x+5,y+10,8);
        });

        //Draw Origin Point
        Draw.point(this.x,this.y,point_size,"black",false,line_width-1);
        Draw.point(this.x,this.y,point_size,origin_color);
        Draw.text(this.#id,this.x,this.y-5,text_size);
    }

    get_id() {
        return this.#id;
    }

    handle_debug_mode() {
        this.draw();
        const detection_radius = 4;

        //Held Point Parameters
        const point_size = 3.5;
        const origin_color = "rgba(255, 215, 159, 0.9)";
        const hover_color = "rgba(151, 255, 117, 1)"
        const held_color = "rgba(255, 78, 34, 1)";
        const line_width = point_size;        

        this.offset_points.forEach((p,i)=>{
            if (!mouse.hovered && Collision.point_with_point(this.x+p.x,this.y+p.y,mouse.x,mouse.y,detection_radius)) {
                mouse.hovered = p;
            }

            if (mouse.hovered==p && !Collision.point_with_point(this.x+p.x,this.y+p.y,mouse.x,mouse.y,detection_radius)) {
                mouse.hovered=null;
            }

            if (mouse.hovered==p) {
                p.color = hover_color;
                p.size=p.base_size+1;
            }
            else {
                p.color = p.base_color;
                p.size = p.base_size;
            }

            if (mouse.held==p) {
                p.x = mouse.x - this.x;
                p.y = mouse.y - this.y;
                p.color = "pink";
                //Draw.point(this.x+p.x,this.y+p.y,p.size,"black",false,line_width-1);
                //Draw.point(this.x+p.x,this.y+p.y,p.size,p.color);
            }
        })

        if (!mouse.hovered && this.is_point_colliding(mouse.x,mouse.y)) {
            mouse.hovered=this;
        }

        if (mouse.hovered==this && !this.is_point_colliding(mouse.x,mouse.y)) {
            mouse.hovered=null;
        }
        

        if (mouse.held==this) {
            mouse.move_obj(this);
            //Draw.point(this.x,this.y,point_size,"black",false,line_width-1);
            //Draw.point(this.x,this.y,point_size,origin_color);
            this.offset_points.forEach((p)=>{
                p.color = "red";
            });
        }
        
    }

    static get_entity_list() {
        return CollisionArea.#entity_list;
    }

    is_point_colliding(x,y) {
        let above = false;
        let below = false;
        let left = false;
        let right = false;

        for (let i = 0; i < this.offset_points.length; i++) {
            const p = this.offset_points[i];
            const np = this.offset_points[(i+1)%this.offset_points.length];

            const x1 = this.x+p.x;
            const y1 = this.y+p.y;
            const x2 = this.x+np.x;
            const y2 = this.y+np.y;

            let check;

            if (np.x>p.x) {
                check = "below";
            }
            if (np.x<p.x) {
                check = "above";
            }
            if (p.y<=np.y && p.x==np.x) {
                check = "left";
            }
            if (p.y>=np.y && p.x==np.x) {
                check = "right";
            }

            //Draw.text(p.get_id()+"->"+np.get_id()+check,(np.x-p.x)/2+this.x+p.x,(np.y-p.y)/2+this.y+p.y,9);

            if (!above && check=="above") {
                above = Collision.is_point_above_line(x,y,x1,y1,x2,y2);
            }
            if (!below && check=="below") {
                below = Collision.is_point_below_line(x,y,x1,y1,x2,y2);
            }
            if (!left && check=="left") {
                left = Collision.is_point_to_left_of_line(x,y,x1,y1,x2,y2);
            }
            if (!right && check=="right") {
                right = Collision.is_point_to_right_of_line(x,y,x1,y1,x2,y2);
            }
            // /console.log(above,right,below,left);
            

            if ((above && below) || (left && right)) {
                return true;
            }
        }

        return false;
    }
}