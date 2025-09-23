import { CollisionArea } from "../../collision/collision.js";
import StaticBody from "../../entities/bodies/staticBody.js";
import Geometry from "../../geometry/geometry.js";



export default class DebugBlock1 extends StaticBody{

    constructor(x,y) {
        const w = 130;
        const h = 160;
        const collision_mesh = Geometry.generate_rect_mesh(x,y,w,h);
        const collision_area = new CollisionArea(collision_mesh);

        super(x,y,collision_area);
    }
}



