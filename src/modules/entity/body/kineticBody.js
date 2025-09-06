import Vector from "../../geometry/vector.js";
import CollisionArea from "../../area/collisionArea.js";
import { CollisionData } from "../../area/collisionArea.js";
import Sprite from "../../visuals/sprite.js";
import Body from "./body.js";
import Entity from "../entity.js";
import * as Draw from "../../draw.js"
import Vertex from "../../geometry/vertex.js";
import Edge from "../../geometry/edge.js";
import Line from "../../geometry/line.js";

export default class KineticBody extends Body {
    movementVector = new Vector();
    debugEnabled=false;
    gravityVector = new Vector(undefined,undefined);
    

    /**
     * @param {CollisionArea} collisionArea 
     */
    constructor(x,y,collisionArea) {
        super(x,y,collisionArea);       
         
    }

    /**
     * @param {Sprite} sprite 
     */

    move(dx,dy) {
        this.movementVector.x = dx;
        this.movementVector.y = dy;
        
        this.movementVector.normalize();
        
        dx = this.movementVector.x;
        dy = this.movementVector.y;
        this.x+=dx;
        this.y+=dy;
        this.collisionArea.move(dx,dy);
        this.drawings.forEach(d=>{
            d.move(dx,dy);
        });
    }


    handleGravity() {     
        this.gravityVector.normalize();
        
        const dx = this.gravityVector.x;
        const dy = this.gravityVector.y;
        this.x+=dx;
        this.y+=dy;
        this.collisionArea.move(dx,dy);
        this.drawings.forEach(d=>{
            d.move(dx,dy);
        });
    }

    doPhysics() {
        this.handleGravity();
        super.doPhysics();
    }

    /**
     * 
     * @param {CollisionData} collisionData 
     * @returns 
     */
    handleCollision(collisionData) {
        if (!collisionData) {return;}
        //console.log("Handling colliding");

        //PLAN: if the distance on the collided distances are both within a small range, use them both to push out.
        //console.log(collisionData.colliding_vertices.length);
        
        collisionData.colliding_vertices.forEach((v,i)=>{
            //console.log(collisionData);
            const cce = collisionData.closest_collided_edges[i]
            const point_proj = collisionData.point_projections[i];
            const norm = collisionData.normals_to_vertices[i];
            
            
            //norm.scale(-1).draw(point_proj.x,point_proj.y,"orange",2);
            //Draw.point(point_proj,3,"blue");
            //console.log(cce.getId());
            
            
            this.move(norm.x,norm.y);

        });
        collisionData.point_casters.forEach((p,i)=>{
            const n = collisionData.edge_normals[i];
            if (isNaN(n.x) || isNaN(n.y)) {
                return;
            }
            
            this.move(n.x,n.y);
            n.scale(-1).draw(p.x,p.y,"red");
            //p.draw(5)
           // p.draw(4.5,"pink");
        });

    }
    
}