import Collision from "../collision/collision.js";
import Draw from "../draw.js";
import Geometry from "../geometry/geometry.js";
import Vector from "../geometry/vector.js";
import mouse from "../mouse.js";
import Utils from "../utils.js";
import Body from "./body.js";
import StaticBody from "./static-body.js";

export default class KineticBody extends Body {
    class_name = KineticBody;
    /**@type {KineticBody[]} */
    static #entity_list = [];
    class_nickname = "KB";

    #idx;
    #id;

    /**@type {Vector} */
    velocity = new Vector(0,0);

    /**@type {Vector} */
    max_gravity = new Vector(0,26);
    /**@type {Vector} */
    gravity = new Vector(0,0);
    grav_constant = 1;

    /**@type {Number} */
    airtime = 0;
    airtime_constant = .15;

    constructor(x,y,collision_area) {
        super(x,y,collision_area);
        this.class_name.#entity_list.push(this);
        this.#idx = this.class_name.#entity_list.length-1;
        this.#id = this.class_nickname + this.#idx;
    }

    physics() {
        super.physics();
        this.handle_gravity();
        this.check_grounded();

        this.velocity.clear();
    }

    check_grounded() {
        if (mouse.holding(this)) {return false;}
        const lps = this.collision_area.get_lowest_point(true);
        const pre = lps.pre;
        const lp = lps.lp;
        const next = lps.next;

        const offset = 2;

        const prex = pre.x + this.collision_area.x;
        const prey = pre.y + this.collision_area.y+offset;
        const lpx = lp.x + this.collision_area.x;
        const lpy = lp.y + this.collision_area.y+offset;
        const nextx = next.x + this.collision_area.x;
        const nexty = next.y + this.collision_area.y+offset;

        //Draw.line(lpx,lpy,nextx,nexty,"red");
        //Draw.line(lpx,lpy,prex,prey,"red");
        //Draw.point(lpx,lpy,3,"red");

        const entity_list = StaticBody.get_entity_list();
        for (let i=0; i<entity_list.length; i++) {
            const b = entity_list[i];
            if (b==this) {continue;}

            for (let j=0; j<b.collision_area.offset_points.length; j++) {
                const op = b.collision_area.offset_points[j];
                const opx = op.x + b.collision_area.x;
                const opy = op.y + b.collision_area.y;

                const nop = b.collision_area.offset_points[(j+1)%b.collision_area.offset_points.length];
                const nopx = nop.x + b.collision_area.x;
                const nopy = nop.y + b.collision_area.y;

                const orient = Geometry.get_line_orientation(opx,opy,nopx,nopy);
                if (orient=="below" || orient=="left" || orient=="right") {
                    let ip = Collision.get_lines_intersection(lpx,lpy,nextx,nexty,opx,opy,nopx,nopy);
                    if (!ip) {
                        ip = Collision.get_lines_intersection(lpx,lpy,prex,prey,opx,opy,nopx,nopy);
                    }

                    if (ip) {
                        //Draw.point(ip.x,ip.y,5);
                        return true;
                    }
                }
            }
            
        }
        return false;
    }

    handle_movement_collision(dx=0,dy=0) {
        //local velocity
        const lv = new Vector(dx,dy);

        //base local velocity
        const bv = lv.copy();
        //this.collision_area.draw(bv.x,bv.y);
        
        
        const entity_list = Body.get_entity_list();
        //for each other body,
        entity_list.forEach(o=>{
            if (o==this) {return;}
            //vector representing how much to push back the velocity
            let diff_vec = new Vector(0,0);

            //form lines from where we are and where we are going to be (future points)
            this.collision_area.offset_points.forEach(p=>{
                const px = p.x+this.collision_area.x;
                const py = p.y+this.collision_area.y;
                const fpx = px+bv.x;
                const fpy = py+bv.y;

                //Draw.line(px,py,fpx,fpy,"cyan");
                
                //form lines (edges) of the other body 
                o.collision_area.offset_points.forEach((op,i,oop)=>{
                    const opx = op.x+o.collision_area.x;
                    const opy = op.y+o.collision_area.y;

                    const nop = oop[(i+1)%oop.length];
                    const nopx = nop.x+o.collision_area.x;
                    const nopy = nop.y+o.collision_area.y;

                    //Draw.line(opx,opy,nopx,nopy,"red",.5);

                    //check if the future lines intersect with the other body
                    const ip = Collision.get_lines_intersection(px,py,fpx,fpy,opx,opy,nopx,nopy);
                    if (ip) {
                        //Draw.point(ip.x,ip.y,3,"black",false);
                        //Draw.point(ip.x,ip.y,2,"blue");
                        //Draw.line(ip.x,ip.y,fpx,fpy,"blue");

                        //vector representing distance between future points and intersection of other body
                        const local_diff = new Vector(fpx-ip.x,fpy-ip.y).scale(-1.001);

                        //try and get the maximum diff
                        if (local_diff.get_magnitude() > diff_vec.get_magnitude()) {
                            diff_vec = local_diff;
                        }
                    }
                });
            });

            //edit the velocity with the diff
            lv.add(diff_vec);

            o.collision_area.offset_points.forEach((op)=>{
                const opx = op.x+o.collision_area.x;
                const opy = op.y+o.collision_area.y;

                //Draw.line(opx,opy,opx+bv.x,opy+bv.y,"bluegreen");

                this.collision_area.offset_points.forEach((p,i,ops)=>{
                    const px = p.x+this.collision_area.x+lv.x;
                    const py = p.y+this.collision_area.y+lv.y;

                    const np = ops[(i+1)%ops.length];
                    const npx = np.x+this.collision_area.x+lv.x;
                    const npy = np.y+this.collision_area.y+lv.y;

                    const ip = Collision.get_lines_intersection(opx,opy,opx+bv.x,opy+bv.y,px,py,npx,npy);
                    if (ip) {
                        //Draw.line(px,py,npx,npy,"orange",2.5);
                        //Draw.point(ip.x,ip.y,3,"red");
                        const point_diff = new Vector(opx-ip.x,opy-ip.y).scale(1.001);
                        lv.add(point_diff);
                    }
                });
            });
            
        });

        //this.collision_area.draw(lv.x,lv.y);
        

        //lv.clear()
        
        this.x+=lv.x;
        this.y+=lv.y;
        this.collision_area.move(lv.x,lv.y);

        const diff = new Vector(bv.x-lv.x,bv.y-lv.y);
        if (diff.x && diff.y) {
            this.handle_movement_collision(bv.x,0);
            this.handle_movement_collision(0,bv.y);
        }

    }

    move(dx,dy) {
        this.handle_movement_collision(dx,dy);
    }

    static get_entity_list() {
        return KineticBody.#entity_list;
    }

    get_id() {
        return this.#id;
    }

    handle_gravity() {
        this.move(this.gravity.x,this.gravity.y);

        if (!this.check_grounded() && !mouse.holding(this)) {
            this.airtime++;
        }
        else {
            this.airtime = 0;
        }

        this.gravity.y = Utils.clamp(-Math.abs(this.max_gravity.y), Math.pow(this.airtime*this.airtime_constant*this.grav_constant,2),Math.abs(this.max_gravity.y));
    }
}