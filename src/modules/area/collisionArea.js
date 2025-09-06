import Mesh from "../geometry/mesh.js";
import Edge from "../geometry/edge.js";
import * as Draw from "../draw.js";
import * as Utils from "../utils.js";
import Mouse from "../peripherals/mouse.js";
import Geometry from "../geometry/geometry.js";
import Area from "./area.js";
import Entity from "../entity/entity.js";
import Body from "../entity/body/body.js";
import Vertex from "../geometry/vertex.js";
import Vector from "../geometry/vector.js";
import Point from "../geometry/point.js";
import KineticBody from "../entity/body/kineticBody.js";
import StaticBody from "../entity/body/staticBody.js";


export default class CollisionArea extends Area{

    /**
     * @param {Mesh} mesh
     */
    constructor(mesh){
        super(mesh);
    }

    isMouseColliding() {
        let belowAnEdge = false;
        let aboveAnEdge = false;
        const m = Mouse.getPosition();

        /*Note: Adding a number to the height should not change anything except for debugging wise when testing an individual edge
          rather than the whole mesh.*/
        const h = this.getHeight()+50;

        for(let i=0; i<this.mesh.edges.length; i++) {
            const edge = this.mesh.edges[i];
            const v1 = edge.v1;
            const v2 = edge.v2;
    
            if (belowAnEdge==false && edge.orientation=="down" && Geometry.isPointBelowLine(m.x,m.y,v1.x,v1.y,v2.x,v2.y,h)) {
                //console.log("with",edge.id);
                belowAnEdge=true;
            }
            if (aboveAnEdge==false && edge.orientation=="up" && Geometry.isPointAboveLine(m.x,m.y,v1.x,v1.y,v2.x,v2.y,h)) {
                //console.log("with",edge.id);
                aboveAnEdge=true;
            }
            /*
            if (aboveAnEdge==false && edge.orientation=="up" && Utils.isPointWithinRegion(m.x,m.y,[[v1.x,v1.y],[v2.x,v2.y],[v1.x,v1.y-h],[v2.x,v2.y-h]])) {
                console.log("with",edge.id);
                aboveAnEdge=true;
            }
            */
        }
        //console.log(belowAnEdge && aboveAnEdge);
        
        return belowAnEdge && aboveAnEdge;
    }

    handleDebugMode() {
        super.handleDebugMode();

        const range = this.getHeight();
        this.mesh.edges.forEach(e=>{
            if (e.isVertical()) {return;}
            let v1;
            let v2;
            let v3;
            let v4;
            if (e.orientation=="down") {
                v1 = e.v1;
                v2 = e.v2;
                if (e.v2.x<e.v1.x) {
                    v1 = e.v2;
                    v2 = e.v1;
                }
                v3 = {x:v2.x,y:v2.y+range};
                v4 = {x:v1.x,y:v1.y+range};
            }
            else if (e.orientation=="up") {
                v4 = e.v1;
                v3 = e.v2;
                if (e.v2.x<e.v1.x) {
                    v4 = e.v2;
                    v3 = e.v1;
                }
                v1 = {x:v4.x,y:v4.y-range};
                v2 = {x:v3.x,y:v3.y-range};
            }
            Draw.area([[v1.x,v1.y],[v2.x,v2.y],[v3.x,v3.y],[v4.x,v4.y]],e.color,Utils.clamp(.1,e.opacity-3,1));
        });
    }

    /**
     * 
     * @param {Entity} obj 
     */
    isCollidingWith(obj) {
        /**@type {CollisionData} result */
        let result = null;
        if ('collisionArea' in obj && obj.collisionArea!=null && obj instanceof StaticBody ) {
            /**
             * @type {Mesh}
             */
            const obj_mesh = obj.collisionArea.mesh;
            const obj_edges = obj_mesh.edges;
            for (let i =0; i<this.mesh.vertices.length; i++) {
                /**
                 * @type {Vertex}
                 */
                const v = this.mesh.vertices[i];
                let belowEdge = false;
                let aboveEdge = false;

                //collision check every edge for each vertex
                for (let j =0; j<obj_edges.length; j++) {
                    /**
                     * @type {Edge}
                     */
                    const edge = obj_edges[j];
                    const line = edge.to_line();
                    //const proj = v.to_point().projectionOnGeometricLine(line);
                    //Draw.point(Draw.point,3,"red");
                    //console.log("testing",edge.getId());
                    
                    if (edge.orientation=="down" && Geometry.isPointBelowGeometricLine(v.x,v.y,line)) {
                        //console.log(v.id,"is below",edge.getId());
                        belowEdge=edge;
                    }
                    if (edge.orientation=="up" && Geometry.isPointAboveGeometricLine(v.x,v.y,line)) {
                        //console.log(v.id,"is above",edge.getId());
                        aboveEdge=edge;
                    }

                    if (belowEdge && aboveEdge) {
                        break;
                    }
                }

                //if the vertex is colliding
                if (belowEdge && aboveEdge) {
                    //console.log("colliding is",v.id);
                    if (!result) {
                        result = new CollisionData(obj);
                    }

                    const vertex_point = v.to_point();

                    /**
                     * @type {Edge}
                     */
                    let cce = belowEdge;
                    
                    obj.collisionArea.mesh.edges.forEach(/** @param {Edge} e*/e=>{
                        let cce_line = cce.to_line();
                        let cce_umbra = Geometry.point_umbra_of_line(vertex_point,cce_line);
                        //let cce_normal = Geometry.normal_of_line_to_point(cce_line,vertex_point);
                        const d1 = cce_umbra.distanceToPoint(vertex_point);

                        let e_line = e.to_line();
                        let e_umbra = Geometry.point_umbra_of_line(vertex_point,e_line);
                        //let e_normal = Geometry.normal_of_line_to_point(e_line,vertex_point);
                        const d2 = e_umbra.distanceToPoint(vertex_point);

                        //e_normal.scale(-1).draw(e_umbra.x,e_umbra.y,);
                        //e_umbra.draw(3,"red");
                        if (d2<d1) {
                            cce = e;
                        }
                    });
                    //console.log(v.id,"with",cce.getId());
                    
                    let cce_line = cce.to_line();
                    let cce_umbra = Geometry.point_umbra_of_line(vertex_point,cce_line);
                    let cce_normal = Geometry.normal_of_line_to_point(cce_line,vertex_point).scale(1.0001);

                    result.colliding_vertices.push(v);
                    result.normals_to_vertices.push(cce_normal);
                    result.point_projections.push(cce_umbra);
                    result.closest_collided_edges.push(cce);
                    /**
                     * @type {Vertex} ccv
                     */
                    let ccv = cce.v1;
                    if (cce.v2.distance_to(v)<ccv.distance_to(v)) {
                        ccv = cce.v2;
                    }
                    result.closest_collided_vertices.push(ccv);
                }
            }

            for (let i=0; i<this.mesh.edges.lengthssssssssss; i++) {
                const edge = this.mesh.edges[i];
                const line = edge.to_line();
                const p1 = new Point(line.x1,line.y1);
                const p2 = new Point(line.x2,line.y2);

                for (let j=0; j<obj_edges.length; j++) {
                    /**
                     * @type {Edge}
                     */
                    const other_edge = obj_edges[j];
                    const other_line = other_edge.to_line().ordered();
                    const op1 = new Point(other_line.x1,other_line.y1);
                    const op2 = new Point(other_line.x2,other_line.y2);


                    const cast1 = Geometry.point_cast_of_line(p1,other_line);
                    const cast2 = Geometry.point_cast_of_line(p2,other_line);
                    const ocast1 = Geometry.point_cast_of_line(op1,line);
                    const ocast2 = Geometry.point_cast_of_line(op2,line);

                    const cast_count = ((cast1!=undefined)) + ((cast2!=undefined)) + ((ocast1!=undefined)) + ((ocast2!=undefined));
                    //console.log(cast_count);
                    

                    //if the edge intercepts the other
                    if (cast_count>=2) {          
                        
                        const norm_scale = -1.0001;
                        let pushed_pc;
                        let pushed_en;
                        if (!result) {
                            result = new CollisionData(obj);
                        }
                        if (cast1 && cast2) {
                            if ((p1.y<=cast1.y && p2.y>=cast2.y) || (p2.y<=cast2.y && p1.y>=cast1.y)) {
                                //console.log("pure intercepts!");
                                if (other_edge.orientation=="down") {
                                    if (Geometry.isPointBelowGeometricLine(p1.x,p1.y,other_line)) {
                                        const n1 = Geometry.normal_of_point_to_line(p1,other_line).scale(norm_scale);
                                        pushed_pc = p1;
                                        pushed_en = n1;
                                    }
                                    else if (Geometry.isPointBelowGeometricLine(p2.x,p2.y,other_line)) {
                                        const n2 = Geometry.normal_of_point_to_line(p2,other_line).scale(norm_scale);
                                        pushed_pc = p2;
                                        pushed_en = n2;
                                    }
                                }
                                else if (other_edge.orientation=="up") {
                                    if (Geometry.isPointAboveGeometricLine(p1.x,p1.y,other_line)) {
                                        const n1 = Geometry.normal_of_point_to_line(p1,other_line).scale(norm_scale);
                                        pushed_pc = p1;
                                        pushed_en = n1;
                                    }
                                    else if (Geometry.isPointAboveGeometricLine(p2.x,p2.y,other_line)) {
                                        const n2 = Geometry.normal_of_point_to_line(p2,other_line).scale(norm_scale);
                                        pushed_pc = p2;
                                        pushed_en = n2;
                                    }
                                }
                            }
                        }
                        
                        else if (cast1) {
                            if (ocast1) {
                                const him = p1;
                                const himcast = cast1;
                                const her = op1;
                                const hercast = ocast1;
                                if ((him.y<=himcast.y && hercast.y>=her.y) || (him.y>=himcast.y && hercast.y<=her.y)) {
                                    //console.log("mixed intercepts1!");
                                    const n = Geometry.normal_of_point_to_line(him,other_line).scale(norm_scale)
                                    pushed_pc = him;
                                    pushed_en = n;
                                }
                            }
                            else {
                                const him = p1;
                                const himcast = cast1;
                                const her = op2;
                                const hercast = ocast2;
                                if ((him.y<=himcast.y && hercast.y>=her.y) || (him.y>=himcast.y && hercast.y<=her.y)) {
                                    //console.log("mixed intercepts2!");
                                    const n = Geometry.normal_of_point_to_line(him,other_line).scale(norm_scale)
                                    pushed_pc = him;
                                    pushed_en = n;
                                }
                            }
                        }
                        else if (cast2) {
                            if (ocast1) {
                                const him = p2;
                                const himcast = cast2;
                                const her = op1;
                                const hercast = ocast1;
                                if ((him.y<=himcast.y && hercast.y>=her.y) || (him.y>=himcast.y && hercast.y<=her.y)) {
                                    //console.log("mixed intercepts3!");
                                    const n = Geometry.normal_of_point_to_line(him,other_line).scale(norm_scale)
                                    pushed_pc = him;
                                    pushed_en = n;
                                }
                            }
                            else {
                                const him = p2;
                                const himcast = cast2;
                                const her = op2;
                                const hercast = ocast2;
                                if ((him.y<=himcast.y && hercast.y>=her.y) || (him.y>=himcast.y && hercast.y<=her.y)) {
                                    //console.log("mixed intercepts4!");
                                    const n = Geometry.normal_of_point_to_line(him,other_line).scale(norm_scale)
                                    pushed_pc = him;
                                    pushed_en = n;
                                }
                            }
                        }
                        if (pushed_pc) {
                            
                            let cce = other_edge;
                            for (let k=0; k<obj_edges.length; k++) {
                                const ed = obj_edges[k];

                                const u1 = Geometry.point_umbra_of_line(pushed_pc,cce.to_line());
                                const u2 = Geometry.point_umbra_of_line(pushed_pc,ed.to_line());

                                if (u2.distanceToPoint(pushed_pc) < u1.distanceToPoint(pushed_pc)) {
                                    cce = ed;
                                }
                                
                            }
                            let belowEdge = false;
                            let aboveEdge = false;

                            //collision check every edge for each vertex
                            for (let k =0; k<obj_edges.length; k++) {
                                /**
                                 * @type {Edge}
                                 */
                                const edge = obj_edges[k];
                                const line = edge.to_line();
                                //const proj = v.to_point().projectionOnGeometricLine(line);
                                //Draw.point(Draw.point,3,"red");
                                //console.log("testing",edge.getId());
                                
                                if (edge.orientation=="down" && Geometry.isPointBelowGeometricLine(pushed_pc.x,pushed_pc.y,line)) {
                                    //console.log(v.id,"is below",edge.getId());
                                    belowEdge=edge;
                                }
                                if (edge.orientation=="up" && Geometry.isPointAboveGeometricLine(pushed_pc.x,pushed_pc.y,line)) {
                                    //console.log(v.id,"is above",edge.getId());
                                    aboveEdge=edge;
                                }

                                if (belowEdge && aboveEdge) {
                                    break;
                                }
                            }
                            if (aboveEdge && belowEdge) {
                                const n = Geometry.normal_of_point_to_line(pushed_pc,cce.to_line()).scale(norm_scale);
                                result.point_casters.push(pushed_pc);
                                result.edge_normals.push(n);    
                            }
                            
                        }
                    }
                }
            }
  
        }
        return result;
    }

}



export class CollisionData {
    /**
     * @type {Entity}
     */
    collided;
    /**
     * @type {Vertex[]}
     */
    colliding_vertices = [];
    /**
     * @type {Vector[]}
     */
    normals_to_vertices = [];
    /**
     * @type {Point[]}
     */
    point_projections = [];
    /**
     * @type {Vertex[]}
     */
    closest_collided_vertices = [];
    closest_collided_edges = [];

    /**
     * @type {Vector[]}
     */
    edge_normals = []

    /**
     * @type {Point[]}
     */
    point_casters = [];
    constructor (collided) {
        this.collided = collided;
    }
}