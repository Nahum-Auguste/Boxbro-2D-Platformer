import { CollisionArea } from "../../collision/collision.js";
import StaticBody from "../../entities/bodies/staticBody.js";
import Geometry from "../../geometry/geometry.js";



export default class DebugBlock2 extends StaticBody{

    constructor(x,y) {
        const w = 730;
        const h = 100;
        const collision_mesh = Geometry.generate_rect_mesh(x,y,w,h);
        const collision_area = new CollisionArea(collision_mesh);

        super(x,y,collision_area);
    }
}