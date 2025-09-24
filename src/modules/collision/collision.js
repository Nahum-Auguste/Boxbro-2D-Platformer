import Geometry from "../geometry/geometry.js";
import Draw from "../draw.js";
import Edge from "../geometry/edge.js";
import Point from "../geometry/point.js";
import Line from "../geometry/line.js";
import Utils from "../utils.js";
import mouse from "../peripherals/mouse.js";
import Body from "../entities/bodies/body.js";


export default class Collision {
    static is_point_within_circle(x,y,cx,cy,r) {
        const relx = x-cx;
        const rely = y-cy;
        return (relx*relx + rely*rely <= r*r);
    }

    static is_point_below_line(px,py,options={},x1,y1,x2,y2,range=Infinity) {
        const debug = !true;
        /**
         * @type {Line}
         */
        let line = options.line;
        if (x1) {
            line = new Line({},x1,y1,x2,y2);
        }
        line = line.ordered();
        x1 = line.x1;
        y1 = line.y1;
        x2 = line.x2;
        y2 = line.y2;

        const rx = px - x1;
        const dx = x2-x1;
        const dy = y2-y1;
        const slope = dy/dx;

        const y = slope*rx + y1;


        if (options.range) {
            range = options.range;
        }

        if (debug) {
            options.line.draw(1,"purple");
            Draw.area([{x:x1,y:y1},{x:x2,y:y2},{x:x2,y:y2+Utils.clamp(-1000,range,1000)},{x:x1,y:y1+Utils.clamp(-1000,range,1000)}],"rgba(248, 146, 255, 0.57)")
        }

        if (options.constricted==undefined || options.constricted==true) {
            if (px>x2 || px<x1) {
                return false;
            }
        }

        if (py>=y && py<=y+range) {
            if (debug) {
                Draw.point_extra({x:px,y,border:true,color:"silver",iris:true})
            }
            return true;
        }

        return false;
    }

    static is_point_above_line(px,py,options={},x1,y1,x2,y2,range=Infinity) {
        const debug = !true;
        /**
         * @type {Line}
         */
        let line = options.line;
        if (x1) {
            line = new Line({},x1,y1,x2,y2);
        }
        line = line.ordered();
        x1 = line.x1;
        y1 = line.y1;
        x2 = line.x2;
        y2 = line.y2;

        const rx = px - x1;
        const dx = x2-x1;
        const dy = y2-y1;
        const slope = dy/dx;

        let y = slope*rx + y1;

        if (options.range) {
            range = options.range;
        }

        if (debug) {
            options.line.draw(1,"purple");
            Draw.area([{x:x1,y:y1},{x:x2,y:y2},{x:x2,y:y2-Utils.clamp(-1000,range,1000)},{x:x1,y:y1-Utils.clamp(-1000,range,1000)}],"rgba(248, 146, 255, 0.57)")
        }

        if (options.constricted==undefined || options.constricted==true) {
            if (px>x2 || px<x1) {
                return false;
            }
        }

        if (py<=y && py>=y-range) {
            if (debug) {
                Draw.point_extra({x:px,y,border:true,color:"silver",iris:true})
            }
            return true;
        }

        return false;
    }

    static is_point_to_right_of_line(px,py,options={},x1,y1,x2,y2,range=Infinity) {
        const debug = !true;
        /**
         * @type {Line}
         */
        let line = options.line;
        if (x1) {
            line = new Line({},x1,y1,x2,y2);
        }
        line = line.ordered(true);
        x1 = line.x1;
        y1 = line.y1;
        x2 = line.x2;
        y2 = line.y2;

        const ry = py - y1;
        const dx = x2-x1;
        const dy = y2-y1;
        const slope = dx/dy;

        let x = slope*ry + x1;

        if (options.range) {
            range = options.range;
        }

        if (debug) {
            options.line.draw(1,"purple");
            Draw.area([{x:x1,y:y1},{x:x2,y:y2},{x:x2+Utils.clamp(-1000,range,1000),y:y2},{x:x1+Utils.clamp(-1000,range,1000),y:y1}],"rgba(248, 146, 255, 0.57)")
        }

        if (options.constricted==undefined || options.constricted==true) {
            if (py>y2 || py<y1) {
                return false;
            }
        }

        if (px>=x && px<=x+range) {
            if (debug) {
                Draw.point_extra({x,y:py,border:true,color:"silver",iris:true})
            }
            return true;
        }

        return false;
    }

    static is_point_to_left_of_line(px,py,options={},x1,y1,x2,y2,range=Infinity) {
        const debug = !true;
        /**
         * @type {Line}
         */
        let line = options.line;
        if (x1) {
            line = new Line({},x1,y1,x2,y2);
        }
        line = line.ordered(true);
        x1 = line.x1;
        y1 = line.y1;
        x2 = line.x2;
        y2 = line.y2;

        const ry = py - y1;
        const dx = x2-x1;
        const dy = y2-y1;
        const slope = dx/dy;

        let x = slope*ry + x1;

        if (options.range) {
            range = options.range;
        }

        if (debug) {
            options.line.draw(1,"purple");
            Draw.area([{x:x1,y:y1},{x:x2,y:y2},{x:x2-Utils.clamp(-1000,range,1000),y:y2},{x:x1-Utils.clamp(-1000,range,1000),y:y1}],"rgba(248, 146, 255, 0.57)")
        }

        if (options.constricted==undefined || options.constricted==true) {
            if (py>y2 || py<y1) {
                return false;
            }
        }

        if (px<=x && px>=x-range) {
            if (debug) {
                Draw.point_extra({x,y:py,border:true,color:"silver",iris:true})
            }
            return true;
        }

        return false;
    }

    /**
     * 
     * @param {Mesh} mesh 
     * @returns 
     */
    static generate_collision_area(mesh) {
        return new CollisionArea(mesh);
    }
}


export class CollisionArea {
    /**@type {Geometry.Mesh} */
    mesh;

    /**@type {Geometry.Vertex[]} */
    vertices;

    /**@type {Edge[]} */
    edges;

    left_edge_color = "rgba(133, 255, 231, 0.42)"
    right_edge_color = "rgba(255, 231, 133, 0.42)"
    up_edge_color = "rgba(255, 180, 133, 0.42)"
    down_edge_color = "rgba(188, 255, 133, 0.42)"
    
    /**
     * 
     * @param {Geometry.Mesh} mesh 
     */
    constructor(mesh) {
        this.mesh = mesh;
        this.vertices = this.mesh.vertices;
        this.edges = this.mesh.edges;
    }

    //NOTE TO SELF LATER!!! MAKE IT SO WE CAN COPY AN AREA INSTEAD OF MAKING A NEW ONE.
    copy(area) {

    }

    get_copy() {
        return new CollisionArea(Geometry.generate_mesh(Geometry.vertices_to_point_array(this.vertices)));
    }

    draw(color_override){
        this.edges.forEach(e=>{
            //console.log(e);
            
            const v1 = e.v1;
            const v2 = e.v2;
            let p1 = (v1.x<=v2.x)? v1 : v2
            let p2 = (v1.x<=v2.x)? v2 : v1
           
            let p3;
            let p4;
            let color = color_override;
            let range = 0;
            

            switch(e.facing) {
                case "down":
                    if (!color_override){
                        color = this.down_edge_color;
                    }
                    range = this.mesh.get_height()/2;
                    p3 = {x:p2.x,y:p2.y+range};
                    p4 = {x:p1.x,y:p1.y+range};
                    break;
                case "up":
                    if (!color_override){
                        color = this.up_edge_color;
                    }
                    range = this.mesh.get_height()/-2;
                    p3 = new Point(p2.x,p2.y+range);
                    p4 = new Point(p1.x,p1.y+range);
                    break;
                case "left":
                    p1 = v1.y<=v2.y? v1 : v2;
                    p2 = v1.y<=v2.y? v2 : v1;
                    if (!color_override){
                        color = this.left_edge_color;
                    }
                    range = this.mesh.get_width()/-2;
                    p3 = new Point(p2.x+range,p2.y);
                    p4 = new Point(p1.x+range,p1.y);
                    break;
                case "right":
                    p1 = v1.y<=v2.y? v1 : v2;
                    p2 = v1.y<=v2.y? v2 : v1;
                    if (!color_override){
                        color = this.right_edge_color;
                    }
                    range = this.mesh.get_width()/2;
                    p3 = new Point(p2.x+range,p2.y);
                    p4 = new Point(p1.x+range,p1.y);
                    break;
            }
            


            Draw.area([p1,p2,p3,p4],color);

        });
        //this.mesh.draw();
    }

    draw_ids() {
        this.mesh.draw_ids();
    }

    handle_debug_mode(options={}) 
    {
        this.mesh.handle_debug_mode(options);
        let holding = false;
        if (this.is_point_colliding(mouse.x,mouse.y)) {
            //this.draw("rgba(255, 127, 67, 0.54)");
            

            if (mouse.held_obj_data.length==0 && mouse.down) {
                //console.log("asd");
                holding = true;
            }

            if (holding) {
                //this.draw("rgba(21, 255, 127, 0.65)")
                this.vertices.forEach(v=>{
                    mouse.move_object(v);
                });
            }
            
        }
    
        this.draw("rgba(255, 230, 230, 0)");
        
        
        
    }

    is_point_colliding(x,y) {
        let above = false;
        let below = false;
        let left = false;
        let right = false;

        for (let i=0; i<this.edges.length; i++) {
            const e = this.edges[i];
            const line = e.to_line();
            if (!above && e.facing=="up") {
                if (Collision.is_point_above_line(x,y,{line})) {
                    //console.log("above");
                    above = true;
                }
            }
            if (!below && e.facing=="down") {
                if (Collision.is_point_below_line(x,y,{line})) {
                    //console.log("down");
                    below = true;
                }
            }
            if (!right && e.facing=="right") {
                if (Collision.is_point_to_right_of_line(x,y,{line})) {
                    //console.log("right");
                    right = true;
                }
            }
            if (!left && e.facing=="left") {
                if (Collision.is_point_to_left_of_line(x,y,{line})) {
                    //console.log("left");
                    left = true;
                }
            }

            const c = (above && below) + (left && right);
            //console.log(c);
            
            if (c>=1) {
                //console.log("colliding!");
                return true;
            }
        }

        return false;
    }

    /**
     * 
     * @param {Body} obj 
     * @returns 
     */
    is_colliding_with(obj) {
        let oarea;
        if (obj instanceof CollisionArea) {
            oarea = obj;
        }
        else {
            oarea = obj.collision_area;
        }
        for (let i=0; i<this.edges.length;
             i++) {
            const e = this.edges[i];
            const l1 = e.to_line();
            for (let j=0; j<oarea.edges.length;j++) {
                const oe = oarea.edges[j];
                const l2 = oe.to_line();
                const data = l1.intersects(l2,true);
                if (data) {
                    //console.log(data);
                    
                    //console.log(e.get_id(),"collides with",oe.get_id());
                    
                    return new CollisionData(obj,e,oe,data.self_casters,data.other_casters);
                }
            }
        }
        return false;
    }

    /**
     * 
     * @param {Edge} e 
     */
    is_edge_colliding(e) {
        const l = e.to_line();

        for (let i=0; i<Body.get_body_list().length; i++) {
            const b = Body.get_body_list()[i];
            const carea = b.collision_area;
            if (carea==this) {continue;};

            for (let j=0; j<carea.edges.length; j++) {
                const oe = carea.edges[j];
                const ol = oe.to_line();
                if (l.intersection_to(ol)) {
                    return true;
                }
            }
        }

        return false;
    }

}

class CollisionData {
    obj;
    /**@type {Edge} */
    self_edge;
    /**@type {Edge} */
    other_edge;
    self_casters;
    other_casters;

    constructor(obj,se,oe,sc,oc) {
        this.obj=obj;
        this.self_edge = se;
        this.other_edge = oe;
        this.self_casters = sc;
        this.other_casters = oc;
    }
}