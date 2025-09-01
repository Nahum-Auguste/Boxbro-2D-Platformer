import CollisionArea from "./collision/collision-area.js";
import Geometry from "./geometry/geometry.js";
import PlayerObject from "./object/player-object.js";

const x = 170;
const y = 170;
const w = 35;
const h = 80;
const collisionMesh = Geometry.generateSquareMesh(x,y,w,h);
const collisionArea = new CollisionArea(collisionMesh);
export const player = new PlayerObject(x,y,collisionArea,.5);
player.debugEnabled = true;