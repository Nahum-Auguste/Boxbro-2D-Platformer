import CollisionArea from "../../area/collisionArea.js";
import Geometry from "../../geometry/geometry.js";
import Drawing from "../../visuals/drawing.js";
import StaticBody from "../../entity/body/staticBody.js";

//properties
const w = 200;
const h = 150;

export default class DebugBlock1 extends StaticBody {
    drawings;

    constructor(x,y) {
        const collsionMesh = Geometry.generateSquareMesh(x,y,w,h);
        const drawingMesh = Geometry.generateSquareMesh(x,y,w,h);
        const collisionArea = new CollisionArea(collsionMesh);  
        super(x,y,collisionArea);
        const body = new Drawing(drawingMesh,"rgba(227, 227, 227, 1)");
        body.stroke = true;
        body.lineWidth = 1.5;
        this.drawings = [body];
    }
}