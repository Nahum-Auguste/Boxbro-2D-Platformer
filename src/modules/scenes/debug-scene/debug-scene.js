import Scene from "../scene.js"
import CollisionArea from "../../area/collisionArea.js";
import Geometry from "../../geometry/geometry.js";
import Drawing from "../../visuals/drawing.js";
import PlayerEntity from "../../world-object-templates/player/playerEntity.js";
import DebugBlock1 from "../../world-object-templates/ground/debug_block1.js";
import Vector from "../../geometry/vector.js";

const x = 470;
const y = 170;
const w = 80;
const h = 80;
const collisionMesh = Geometry.generateSquareMesh(x,y,w,h,"center");
const collisionArea = new CollisionArea(collisionMesh);
const player = new PlayerEntity(x,y,collisionArea,1,);
//player.setDrawing(new Drawing(Geometry.generateSquareMesh(x,y,w,h,"center")));
player.debugEnabled = true;
player.name = "player";
//player.gravityVector = new Vector(0,0);

const entities = [
    player,
    new DebugBlock1(250,300)
];


export default new Scene(entities);