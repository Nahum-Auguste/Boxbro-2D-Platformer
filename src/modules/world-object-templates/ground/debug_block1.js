import CollisionArea from "../../area/collisionArea.js";
import Geometry from "../../geometry/geometry.js";
import Drawing from "../../visuals/drawing.js";
import StaticBody from "../../entity/body/staticBody.js";

//properties
const w = 50;
const h = w;

export default class DebugBlock1 extends StaticBody {

    constructor(x,y) {
        const collsionMesh = Geometry.generateSquareMesh(x,y,w,h);
        const drawingMesh = Geometry.generateSquareMesh(x,y,w,h);
        const collisionArea = new CollisionArea(collsionMesh);  
        super(x,y,collisionArea);
        this.drawings = [new Drawing(drawingMesh,"gray")];
    }
}