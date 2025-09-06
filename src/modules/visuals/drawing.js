import Mesh from "../geometry/mesh.js";
import * as Draw from "../draw.js";

export default class Drawing {
    layers = [];
    mesh;
    opacity = 1;
    color = "black";
    stroke = false;
    strokeColor = "black";
    lineWidth = 1;


    /**
     * 
     * @param {Mesh} mesh 
     * @param {*} color 
     * @param {*} opacity 
     * @param {Drawing[]} layers 
     */
    constructor(mesh,color="black",layers=[],opacity=1,) {
        this.mesh = mesh;
        this.color=color;
        this.opacity=opacity;
        this.layers = [this,...layers];
    }

    draw(color=this.color,opacity=this.opacity) {
        this.layers.forEach((l,i)=>{
            if (i==0) {return;} 
            l.draw();
        });
        const points = [];
        this.mesh.edges.forEach(e=> {
            const v = e.v2;
            points.push([v.x,v.y]);
        });
        Draw.area(points,color,opacity);
        if (this.stroke) {
            this.drawStroke();
        }
    }

    drawStroke(color=this.strokeColor,lineWidth=this.lineWidth,opacity=this.opacity) {
        this.mesh.edges.forEach(e=> {
            const v1 = e.v1;
            const v2 = e.v2;
            Draw.line(v1.x,v1.y,v2.x,v2.y,color,lineWidth,opacity);
        });
    }

    handleDebugMode() {
        this.layers.forEach((l,i)=>{
            if (i==0) {return;} 
            l.handleDebugMode();
        });
        this.mesh.handleDebugMode();
    }

    move(dx,dy) {
        this.layers.forEach((l,i)=>{
            if (i==0) {return;} 
            l.mesh.moveVertices(dx,dy);;
        });
        this.mesh.moveVertices(dx,dy);
    }
}