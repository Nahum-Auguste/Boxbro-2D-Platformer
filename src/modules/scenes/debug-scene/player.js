import CollisionArea from "../../area/collisionArea.js";
import Geometry from "../../geometry/geometry.js";
import Drawing from "../../visuals/drawing.js";
import PlayerEntity from "../../world-object-templates/player/playerEntity.js";

const x = 170;
const y = 170;
const w = 35;
const h = 80;
const collisionMesh = Geometry.generateSquareMesh(x,y,w,h,"center");
const collisionArea = new CollisionArea(collisionMesh);
export const player = new PlayerEntity(x,y,collisionArea,.5,);
player.setDrawing(new Drawing(Geometry.generateSquareMesh(x,y,80,70,"center")));
player.debugEnabled = true;