import KineticBody from "../entity/body/kineticBody.js";
import Vector from "../geometry/vector.js";

export default class Scene {
    gravityVector = new Vector(0,0);
    entity_list=[]

    constructor(entities) {
        this.entity_list = entities;
        this.set_gravity();
    }

    set_gravity() {
        this.entity_list.forEach(e=>{
            //console.log(e.gravityVector,e.getId());
            
            if (e instanceof KineticBody && (e.gravityVector.x==undefined || e.gravityVector.y==undefined)) {
                //console.log("Asd");
                
                e.gravityVector.x = this.gravityVector.x;
                e.gravityVector.y = this.gravityVector.y;
            }
        });
    }
}