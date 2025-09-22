import Body from "./body.js";
import Draw from "../../draw.js";
import Collision, { CollisionArea } from "../../collision/collision.js";
import Vector from "../../geometry/vector.js";
import Geometry from "../../geometry/geometry.js";
import mouse from "../../peripherals/mouse.js";
import Point from "../../geometry/point.js";
import Line from "../../geometry/line.js";
import Utils from "../../utils.js";


export default class KineticBody extends Body {
    static #created_count = 0;
    static #list = [];
    #idx;
    #id;
    #nickname;
    velocity = new Vector(0,0);
    gravity_x=0;
    gravity_y=0;
    gravity = new Vector(0,0);
    grounded = false;
    airtime = 0;
    jumptime = 0;
    jump_constant = 13;
    jump_last_velocity = new Vector(0,0);
    spd=0;
    /**@type {KineticBody} */
    future_self = {
        x:undefined,
        y:undefined,
        collision_area:undefined
    };

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {CollisionArea} collision_area 
     */
    constructor(x,y,collision_area) {
        super(x,y,collision_area);
        this.#idx = KineticBody.#created_count;
        this.#id = KineticBody.name + ":" + this.#idx;
        this.#nickname = "KB" + this.#idx; 
        KineticBody.#created_count++;
        this.collision_area = collision_area;
        KineticBody.#list.push(this);

        this.future_self.x = this.x;
        this.future_self.y = this.y;
        this.future_self.collision_area = this.collision_area.get_copy();
    }

    static get_created_count() {
        return KineticBody.#created_count;
    }

    static get_body_list() {
        return KineticBody.#list;
    }

    get_nickname() {
        return this.#nickname;
    }

    handle_collision() {
        const color_arr = ["red","green","blue","magenta","cyan","yellow"];

        /**
         * @type {Vector}
         */
        let move_vector;

        /**
         * @type {Line[]}
         */
        const temporal_lines = [];
        
        for (let i=0; i<this.future_self.collision_area.vertices.length; i++) 
        {
            const fv = this.future_self.collision_area.vertices[i];
            const v = this.collision_area.vertices[i];

            if (!move_vector) {
                move_vector = new Vector(fv.x-v.x,fv.y-v.y);
            }

            const temporal_line = new Line({},fv.x,fv.y,v.x,v.y);
           //console.log(fv,v,);
            
            //const temporal_line = new Line({},0,0,0,0);
            if (temporal_line.x1==undefined || temporal_line.y1==undefined || temporal_line.x2==undefined || temporal_line.y2==undefined) {
                //console.log(fv,v);
                return;
                
            }
            
            temporal_lines.push(temporal_line);
            //console.log(this.future_self.collision_area.vertices.length,this.collision_area.vertices.length);
            
            //temporal_line.draw(1,color_arr[i%color_arr.length]);
        }

        const intersection_data = [];
        Body.get_body_list().forEach(o=>{
            if (o==this) {return;}

            o.collision_area.edges.forEach(e=>{
                const ol = e.to_line();

                temporal_lines.forEach((tl,idx)=>{
                    const intersection = tl.intersection_to(ol);
                    if (intersection) {
                        intersection_data.push({
                            point:intersection,
                            fv:this.future_self.collision_area.vertices[idx]
                        });
                    }
                })
            })
            
        });

        /**
         * @type {Line}
         */
        let chosen;
        for (let i=0; i<intersection_data.length; i++) {
            const point = intersection_data[i].point;
            const fv = intersection_data[i].fv;
            const line = new Line({},fv.x,fv.y,point.x,point.y);
            //line.draw(1,color_arr[i%color_arr.length]);
            //point.draw_extra({iris:true,border:true,color:"yellow",size:2});

            if (!chosen) {
                chosen = line;
            }
            else {
                if (chosen.to_vector().magnitude()<line.to_vector().magnitude()) {
                    chosen = line;
                }
            }
        }
        if (chosen) {
            //chosen.draw_extra({border:true,color:"white"});
            const diff = chosen.to_vector().scaled(1.001);
            //diff.draw(mouse.x-5,mouse.y-5);
            this.move_future({v:diff});

            const x_comp = diff.x*-1;
            const y_comp = diff.y*-1;
            
            //if diagonal movement, check if future can move in x and y directions individually
            if (diff.x !=0 && diff.y!=0) {
                /**
                 * @type {Line[]}
                 */
                const temporal_x_lines = [];

                for (let i=0; i<this.future_self.collision_area.vertices.length; i++) 
                {
                    const fv = this.future_self.collision_area.vertices[i];

                    //basically make temporal lines from the future future to the future
                    const temporal_x_line = new Line({},fv.x+x_comp,fv.y,fv.x,fv.y);
                    temporal_x_lines.push(temporal_x_line);
                    //temporal_x_line.draw(1.5,color_arr[2]);
                }

                let xintersecting = false;
                for (let j = 0; j<Body.get_body_list().length; j++) {
                    const o = Body.get_body_list()[j];
                    if (o==this) {continue;}

                    for (let k=0; k<o.collision_area.edges.length; k++) {
                        const ol = o.collision_area.edges[k].to_line();

                        for (let l=0; l<temporal_x_lines.length; l++) {
                            const tl = temporal_x_lines[l];
                            
                            
                            //tl.draw(1.5,color_arr[2]);
                            if (tl.intersection_to(ol)) {
                                xintersecting = true;
                                break;
                            }
                        }
                        if (xintersecting) break;
                    }
                    if (xintersecting) break;
                }

                if (!xintersecting) {
                    //temporal_x_lines.forEach(tv=>{tv.draw(2,"blue");})
                    this.move_future({},x_comp,0);
                }

                /**
                 * @type {Line[]}
                 */
                const temporal_y_lines = [];

                for (let i=0; i<this.future_self.collision_area.vertices.length; i++) 
                {
                    const fv = this.future_self.collision_area.vertices[i];

                    //basically make temporal lines from the future future to the future
                    const temporal_y_line = new Line({},fv.x,fv.y+y_comp,fv.x,fv.y);
                    temporal_y_lines.push(temporal_y_line);
                    //temporal_x_line.draw(1.5,color_arr[2]);
                }

                let yintersecting = false;
                for (let j = 0; j<Body.get_body_list().length; j++) {
                    const o = Body.get_body_list()[j];
                    if (o==this) {continue;}

                    for (let k=0; k<o.collision_area.edges.length; k++) {
                        const ol = o.collision_area.edges[k].to_line();

                        for (let l=0; l<temporal_y_lines.length; l++) {
                            const tl = temporal_y_lines[l];
                            
                            
                            //tl.draw(1.5,color_arr[2]);
                            if (tl.intersection_to(ol)) {
                                yintersecting = true;
                                break;
                            }
                        }
                        if (yintersecting) break;
                    }
                    if (yintersecting) break;
                }

                if (!yintersecting) {
                    //temporal_x_lines.forEach(tv=>{tv.draw(2,"blue");})
                    this.move_future({},0,y_comp);
                }
                
            }
        }

        //handle opposing vertex collision
        if (move_vector && (move_vector.x!=0 || move_vector.y!=0)) {
            Body.get_body_list().forEach(o=>{
                if (o==this) {return;}

                o.collision_area.vertices.forEach(v=>{
                    if (this.future_self.collision_area.is_point_colliding(v.x,v.y)) {
                        const vec = move_vector.normalized().scaled(this.collision_area.mesh.get_height() + this.collision_area.mesh.get_width());
                        //vec.draw(v.x,v.y,"magenta");
                        const templine = new Line({},v.x+vec.x,v.y+vec.y,v.x,v.y);
                        for (let i=0; i<this.future_self.collision_area.edges.length; i++) {
                            const e = this.future_self.collision_area.edges[i];
                            const l = e.to_line();
                            const inter = l.intersection_to(templine);
                            if (inter) {
                                const diff = new Vector(v.x-inter.x,v.y-inter.y).scaled(1.001);
                                //diff.draw(inter.x,inter.y,"red");
                                this.move_future({v:diff});
                                break;
                            }
                        }
                    }
                })
            });
        }


    }

    handle_jump() {
        if (this.grounded) {
            this.airtime = 0;
            this.jumptime+=10;
            this.jump_last_velocity.x = this.velocity.x;
            this.jump_last_velocity.y = this.velocity.y;
        }
    }

    check_grounded() {
        if (mouse.is_holding(this)!=-1) {
            this.grounded = false;
            this.airtime = 0;
            return;
        }
        const lv = this.collision_area.mesh.get_lowest_vertex();
        const edges = [lv.left_edge,lv.right_edge];
        const offset = 1;

        for (let i=0; i<edges.length; i++) {
            const e = edges[i];
            const l = new Line({},e.v1.x,e.v1.y+offset,e.v2.x,e.v2.y+offset);
            //l.draw(1,"green")
            //l.draw_extra({color:"red"});
            for (let j=0; j<Body.get_body_list().length; j++) {
                const b = Body.get_body_list()[j];
                if (b==this) {continue;}

                for (let k=0; k<b.collision_area.edges.length; k++) {
                    const oe = b.collision_area.edges[k];
                    //oe.draw(1,"blue")
                    const ol = oe.to_line();
                    if (l.intersection_to(ol)) {
                        this.grounded = true;
                        return;
                    }
                }
            }
        }
        this.grounded = false;
    }

    calculate_gravity() {
        this.gravity.y = Utils.clamp(0,this.gravity_y*Math.pow(this.airtime/30,1),this.gravity_y);
    }

    physics() {
        
        if (!this.grounded && !this.jumptime) {
            this.airtime++;
        }
        
        this.calculate_gravity();
        this.future_self.x = this.x;
        this.future_self.y = this.y;
        this.future_self.collision_area = this.collision_area.get_copy();
        this.move({v:this.velocity});  
        this.move({v:this.gravity})
        if (this.jumptime) {
            this.move({},0,-this.jump_constant);
            this.jumptime = Utils.clamp(0,this.jumptime-1,this.jumptime);
        }
        this.check_grounded();
        if (this.grounded) {
            this.airtime = 0;
            this.jumptime = 0;
            this.jump_last_velocity.clear();
        }
    }

    sync_to_future() {
        this.x = this.future_self.x;
        this.y = this.future_self.y;
        this.collision_area.vertices.forEach((v,i)=>{
            v.x = this.future_self.collision_area.vertices[i].x;
            v.y = this.future_self.collision_area.vertices[i].y;
        });
    }

    move_future(options={},dx=0,dy=0) {
        if (options.vector) {
            dx = options.vector.x;
            dy = options.vector.y;
        }
        if (options.v) {
            dx = options.v.x;
            dy = options.v.y;
        }
        
        
        this.future_self.x+=dx;
        this.future_self.y+=dy;
        this.future_self.collision_area.vertices.forEach(v=>{
            v.x+=dx;
            v.y+=dy;
        });
    }

    move(options={},dx,dy) {
        if (options.vector) {
            dx = options.vector.x;
            dy = options.vector.y;
        }
        if (options.v) {
            dx = options.v.x;
            dy = options.v.y;
        }
        /*
        if (dx!=0 && dy!=0) {
            const u = new Vector(dx,dy).normalized().abs();

            dx *= u.x;
            dy *= u.y;
        }
        */

        this.move_future({},dx,dy);
        this.handle_collision();
        this.sync_to_future();
        this.velocity.clear();
    }

    draw_id() {
        Draw.text({x:this.x,y:this.y-5,text:this.#nickname,centered:true});
        //Draw.text({x:this.future_self.x,y:this.future_self.y+10,text:"FUTURE",centered:true});
    }
}
