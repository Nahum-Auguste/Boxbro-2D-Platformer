import Mesh from "../geometry/mesh.js";
import Edge from "../geometry/edge.js";
import * as Draw from "../draw.js";
import * as Utils from "../utils.js";
import Mouse from "../peripherals/mouse.js";
import Geometry from "../geometry/geometry.js";
import Area from "./area.js";


export default class CollisionArea extends Area{

    /**
     * @param {Mesh} mesh
     */
    constructor(mesh){
        super(mesh);
    }

    isMouseColliding() {
        let belowAnEdge = false;
        let aboveAnEdge = false;
        const m = Mouse.getPosition();

        /*Note: Adding a number to the height should not change anything except for debugging wise when testing an individual edge
          rather than the whole mesh.*/
        const h = this.getHeight()+50;

        for(let i=0; i<this.mesh.edges.length; i++) {
            const edge = this.mesh.edges[i];
            const v1 = edge.v1;
            const v2 = edge.v2;
    
            if (belowAnEdge==false && edge.orientation=="down" && Geometry.isPointBelowLine(m.x,m.y,v1.x,v1.y,v2.x,v2.y,h)) {
                //console.log("with",edge.id);
                belowAnEdge=true;
            }
            if (aboveAnEdge==false && edge.orientation=="up" && Geometry.isPointAboveLine(m.x,m.y,v1.x,v1.y,v2.x,v2.y,h)) {
                //console.log("with",edge.id);
                aboveAnEdge=true;
            }
            /*
            if (aboveAnEdge==false && edge.orientation=="up" && Utils.isPointWithinRegion(m.x,m.y,[[v1.x,v1.y],[v2.x,v2.y],[v1.x,v1.y-h],[v2.x,v2.y-h]])) {
                console.log("with",edge.id);
                aboveAnEdge=true;
            }
            */
        }

        return belowAnEdge && aboveAnEdge;
    }

    handleDebugMode() {
        super.handleDebugMode();

        const range = this.getHeight();
        this.mesh.edges.forEach(e=>{
            if (e.isVertical()) {return;}
            let v1;
            let v2;
            let v3;
            let v4;
            if (e.orientation=="down") {
                v1 = e.v1;
                v2 = e.v2;
                if (e.v2.x<e.v1.x) {
                    v1 = e.v2;
                    v2 = e.v1;
                }
                v3 = {x:v2.x,y:v2.y+range};
                v4 = {x:v1.x,y:v1.y+range};
            }
            else if (e.orientation=="up") {
                v4 = e.v1;
                v3 = e.v2;
                if (e.v2.x<e.v1.x) {
                    v4 = e.v2;
                    v3 = e.v1;
                }
                v1 = {x:v4.x,y:v4.y-range};
                v2 = {x:v3.x,y:v3.y-range};
            }
            Draw.area([[v1.x,v1.y],[v2.x,v2.y],[v3.x,v3.y],[v4.x,v4.y]],e.color,Utils.clamp(.1,e.opacity-3,1));
        });
    }
}