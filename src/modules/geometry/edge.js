import * as Draw from "../draw.js";
import Vertex from "./vertex.js";

/**
 * @property {Vertex} v1
 * @property {Vertex} v2
 * @property {Edge} pre
 * @property {Edge} next
 */
export default class Edge {
    static #madeCount = 0;
    static #existsCount = 0;
    v1;
    v2;
    pre;
    next;
    id="";
    baseColor = "black";
    checkDownColor = "blue";
    checkUpColor = "red";
    color = this.baseColor;
    opacity = 0.5;
    orientation = undefined;

    /**
     * @param {Vertex} v1
     * @param {Vertex} v2
     */
    constructor(v1,v2,name="") {
        Edge.#incrementMadeCount();
        this.v1 = v1;
        this.v2 = v2;
        this.id = name + ":e" + Edge.#madeCount;
    }

    static getMadeCount() {
        return this.#madeCount;
    }

    static getExistsCount() {
        return this.#existsCount;
    }

    static #incrementMadeCount() {
        this.#madeCount++;
        this.#incrementExistsCount();
    }

    static #incrementExistsCount() {
        this.#existsCount++;
    }

    static #decrementExistsCount() {
        this.#existsCount--;
    }

    getAngleRadians() {
        let dy = Math.max(this.v1.y,this.v2.y)-Math.min(this.v1.y,this.v2.y);
        let dx = Math.max(this.v1.x,this.v2.x)-Math.min(this.v1.x,this.v2.x);
        return Math.atan2(dy,dx);
    }

    getAngleDegrees() {
        return this.getAngleRadians()*(180/Math.PI);
    }

    /**
     * 
     * @param {Edge} edge 
     */
    isAboveEdge(edge) {
        if (this==edge) {
            return false;
        }

        //compared this's x's (left to right)
        let ctx1 = Math.min(this.v1.x,this.v2.x);
        let ctx2 = Math.max(this.v1.x,this.v2.x);

        //compared edge's x's (left to right)
        let cox1 = Math.min(edge.v1.x,edge.v2.x);
        let cox2 = Math.max(edge.v1.x,edge.v2.x);

        //compared this's y's (top to bottom, 1 to 2)
        let cty1 = Math.min(this.v1.y,this.v2.y);
        let cty2 = Math.max(this.v1.y,this.v2.y);

        //compared edge's y's (top to bottom, 1 to 2)
        let coy1 = Math.min(edge.v1.y,edge.v2.y);
        let coy2 = Math.max(edge.v1.y,edge.v2.y);

        //if any of the edge's vertices are below this edge, then this is above purely vertically speaking
        if (cty1<coy2 || cty2<coy2) {
            if ((ctx2>cox1 && ctx1<cox1) || (ctx1<cox2 && ctx2>cox2) || (ctx1>=cox1 && ctx2<=cox2)) {   
                //console.log(this.id,"is above",edge.id);            
                return true;
            }
        }

        return false;
    }

    /**
     * 
     * @param {Edge} edge 
     */
    isBelowEdge(edge) {
        if (this==edge) {
            return false;
        }

        //compared this's x's (left to right)
        let ctx1 = Math.min(this.v1.x,this.v2.x);
        let ctx2 = Math.max(this.v1.x,this.v2.x);

        //compared edge's x's (left to right)
        let cox1 = Math.min(edge.v1.x,edge.v2.x);
        let cox2 = Math.max(edge.v1.x,edge.v2.x);

        //compared this's y's (top to bottom, 1 to 2)
        let cty1 = Math.min(this.v1.y,this.v2.y);
        let cty2 = Math.max(this.v1.y,this.v2.y);

        //compared edge's y's (top to bottom, 1 to 2)
        let coy1 = Math.min(edge.v1.y,edge.v2.y);
        let coy2 = Math.max(edge.v1.y,edge.v2.y);

        //if any of the edge's vertices are above this edge, then this is below purely vertically speaking
        if (cty1>coy1 || cty2>coy1) {
            if ((ctx2>cox1 && ctx1<cox1) || (ctx1<cox2 && ctx2>cox2) || (ctx1>=cox1 && ctx2<=cox2)) {   
                //console.log(this.id,"is above",edge.id);            
                return true;
            }
        }

        return false;
    }

    isVertical() {
        return (this.v1.x==this.v2.x);
    }

    draw(lineWidth=1,opacity=this.opacity) {
        Draw.line(this.v1.x,this.v1.y,this.v2.x,this.v2.y,this.color,lineWidth,opacity);
        Draw.text((this.v1.x+this.v2.x)/2,(this.v1.y+this.v2.y)/2,this.id,10);
        Draw.text((this.v1.x+this.v2.x)/2,(this.v1.y+this.v2.y)/2 +10,""+this.orientation,7);
        Draw.text((this.v1.x+this.v2.x)/2,(this.v1.y+this.v2.y)/2 +20,""+Math.round(this.getAngleDegrees())+"\u00B0",7);
    }

    handleDeletion() {
        Edge.#decrementExistsCount();
    }
}