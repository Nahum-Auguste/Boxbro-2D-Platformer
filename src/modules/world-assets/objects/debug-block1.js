import { CollisionArea } from "../../collision/collision.js";
import StaticBody from "../../entities/bodies/staticBody.js";
import Geometry from "../../geometry/geometry.js";
import Drawing from "../../visuals/drawing.js";





export default class DebugBlock1 extends StaticBody{

    constructor(x,y) {
        const w = 130;
        const h = 160;
        const collision_mesh = Geometry.generate_rect_mesh(x,y,w,h);
        const collision_area = new CollisionArea(collision_mesh);

        super(x,y,collision_area);

        const drawing = new Drawing(x,y,Geometry.generate_rect_edgeset(x,y,w,h),"rgba(240, 240, 240, 1)",true,.5);
        this.drawing = drawing;
    }
}



