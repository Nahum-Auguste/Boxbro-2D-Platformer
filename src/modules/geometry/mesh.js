import Vertex from "./vertex.js";
import Edge from "./edge.js";

/**
 * @prop {Vertex[]} this.vertices
 * @prop {Edge[]} this.edges
 */
export default class Mesh {
    vertices = [];
    edges = [];

    /**
     * @param {Vertex[]} vertices
     */
    constructor(vertices) {
        this.vertices = vertices;
        this.constructEdges();
    }

    constructEdges() {
        this.edges = [];
        for (let i=0; i<this.vertices.length; i++) {
            const v1 = this.vertices[i];
            const v2 = this.vertices[(i+1)%this.vertices.length];
            this.edges.push(new Edge(v1,v2));
            
        }
        this.connectEdges();
        this.orientEdges();
    }

    connectEdges() {
        for (let i=0; i<this.edges.length; i++) {
            const pre = this.edges[(i-1)%this.edges.length];
            const edge = this.edges[i];
            const next = this.edges[(i+1)%this.edges.length];
            edge.pre = pre;
            edge.next = next;
        }
    }

    orientEdges() {
        /**
         * @type {Edge} top
         */
        let top = this.edges[0];
        if (top.isVertical()) {top=top.next;}
        for (let i=0; i<this.edges.length; i++) {
            let edge = this.edges[i];
            if ((edge.isVertical()) && (edge.v1.y<=top.v1.y || edge.v1.y<=top.v2.y) && (edge.v2.y<=top.v2.y || edge.v2.y<=top.v1.y )) {
                top = edge;
            }
        }

        if (top.v2.x>top.v1.x) {
            top.orientation = "down";
        }
        else {
            top.orientation = "up";
        }
        //console.log("top:",top.id);

        /**@type {Edge}cur*/
        let cur = top;
        /**@type {Edge}next*/
        let next = cur.next;
        while (next!=top) {
            if (next.isVertical()) {
                next.orientation = cur.orientation;
            }
            else if (cur.isVertical()) {
                if (cur.orientation=="down") {
                    next.orientation="up";
                }
                else {
                    next.orientation="down";
                }
            }
            else {
                if (next.isAboveEdge(cur)) {
                    if (cur.orientation=="down") {
                        next.orientation="up";
                    }
                    else {
                        next.orientation="down";
                    }
                }
                else if (next.isBelowEdge(cur)){
                    if (cur.orientation=="down") {
                        next.orientation="up";
                    }
                    else {
                        next.orientation="down";
                    }
                }
                else {
                    next.orientation = cur.orientation;
                }
            }

            //progress further
            cur = cur.next;
            next = cur.next;
        }

        this.formatEdgeColors();
    }

    formatEdgeColors() {
        this.edges.forEach(e=>{
            if (e.isVertical()){
                e.color = e.baseColor;
            }
            else if (e.orientation=="up") {
                e.color = e.checkUpColor;
            }
            else if (e.orientation=="down") {
                e.color = e.checkDownColor;
            }
            else {
                e.color = e.baseColor;
            }
        });
    }

    getHeight() {
        return this.getLowestVertex().y-this.getHighestVertex().y;
    }

    getLowestVertex() {
        let lowest = this.vertices[0];

        this.vertices.forEach(v => {
            if (v.y>lowest.y) {
                lowest = v;
            }   
        });

        return lowest;
    }

    getHighestVertex() {
        let highest = this.vertices[0];

        this.vertices.forEach(v => {
            if (v.y<highest.y) {
                highest = v;
            }   
        });

        return highest;
    }

    movePositionsUp(amount) {
        this.vertices.forEach(v=>{
            v.y-=amount;
        }); 
    }

    movePositionsDown(amount) {
        this.vertices.forEach(v=>{
            v.y+=amount;
        }); 
    }

    movePositionsLeft(amount) {
        this.vertices.forEach(v=>{
            v.x-=amount;
        }); 
    }

    movePositionsRight(amount) {
        this.vertices.forEach(v=>{
            v.x+=amount;
        }); 
    }

    draw() {
        this.edges.forEach(e=>{e.draw();});
        this.vertices.forEach(v=>{v.draw();});
    }

    printValues() {
        console.log("Vertices:",this.vertices);
        console.log("Edges:",this.edges);
    }
}
