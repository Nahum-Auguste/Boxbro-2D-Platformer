import Mesh from "../geometry/mesh.js";
import * as Draw from "../draw.js";
import * as Utils from "../utils.js";


export default class Area {
    mesh;
    debugEnabled=false;
    debugColor = "pink";
    debugOpacity = .4

    /**
     * @param {Mesh} mesh 
     */
    constructor(mesh) {
        this.mesh = mesh;
    }

    handleDebugMode() {
        this.mesh.handleDebugMode();
        
        const points = [];
        this.mesh.edges.forEach(e=> {
            const v = e.v2;
            points.push([v.x,v.y]);
        });
        Draw.area(points,this.debugColor,this.debugOpacity);
    }

    printValues(){
        this.mesh.printValues();
    }

    getHeight() {
        return this.mesh.getHeight();
    }

    move(x,y) {
        this.mesh.moveVertices(x,y);
    }
}