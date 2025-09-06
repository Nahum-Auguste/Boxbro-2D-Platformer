import Body from "./body.js";
import CollisionArea, { CollisionData } from "../../area/collisionArea.js";
import KineticBody from "./kineticBody.js";
import * as Draw from "../../draw.js";

export default class StaticBody extends Body{

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {CollisionArea} collisionArea 
     */
    constructor(x,y,collisionArea) {
        super(x,y,collisionArea);
    }

    doPhysics() {
        super.doPhysics();
    }

    /**
     * 
     * @param {CollisionData} collisionData 
     */
    handleCollision(collisionData) {
        if (!collisionData) {return;}

        const collided = collisionData.collided;
        if (!(collided instanceof KineticBody)) {return;}
        if (!collisionData) {return;}
        collisionData.colliding_vertices.forEach((v,i)=>{
            const point_proj = collisionData.point_projections[i];
            const norm = collisionData.normals_to_vertices[i];

            Draw.point(point_proj,20);
            norm.draw(point_proj.x,point_proj.y,"orange",4);
            //console.log(norm);
            
            collided.move(-norm.x,norm.y);
        });
    }
}