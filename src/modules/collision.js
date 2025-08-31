import * as Draw from "./draw.js";
import * as Mouse from "./mouse.js";

/**
 * @property {Array} points
 * @property {Array} vertices
 * @property {Array} edges
 */
export class Boundary {
    points;
    vertices;
    edges;
    isAboveColor = "rgba(255, 158, 54, 0.3)";
    isBelowColor = "rgba(187, 98, 255, 0.3)";
    isVerticalColor = "rgba(23, 206, 239, .3)";
    

    /**
     * Constructs a CollisionBoundary using a collisionShape.
     * @param {BoundaryShape} collsionShape 
     */
    constructor(collsionShape) {
        if (collsionShape==null) {return;}
        this.points=collsionShape.points;
        this.edges = this.constructEdges(this.points);
        this.formatEdges();
    }

    /**
     * Converts an Array of points (arrays) into an Array of Vertices.
     * The Array of points must be at least of size 3.
     * Each Vertex stores an x and y property.
     * @param {Array} points 
     * @returns The new Array of Vertices.
     */
    constructVertices(points) {
        if (points.length<3) {
            return;
        }

        let vertices = [];
        class Vertex {
            x=null;
            y=null;
            id=null;
            baseVertexColor = "rgba(71, 212, 255, 0.76)";
            vertexColor = this.baseVertexColor;
            constructor(x,y,id=null) {
                this.x=x;
                this.y=y;
                this.id=id;
            }
        }

        for (let i=0; i<points.length; i++) {
            vertices.push(new Vertex(points[i][0],points[i][1],i));
        }

        return vertices;
    }

    /**
     * Converts an Array of points into an Array of connected Edges.
     * The Array of points must be at least of size 3.
     * Each Edge stores two vertices (v1 and v2) and two other Edges (pre and next) ordered clockwise.
     * @param {Array} points 
     * @returns The new Array of connected Edges.
     */
    constructEdges(points) {
        if (points.length<3) {return;}

        this.vertices = this.constructVertices(points);
        let edges = []; 

        class Edge{
            v1 = null;
            v2 = null;
            pre = null;
            next = null;
            id = null;//NOTE: this is purely for debug purposes.
            isAbove = false;
            isBelow = false;
            checkType = "";
            /**
             * 
             * @param {Vertex} v1 
             * @param {Vertex} v2 
             */
            constructor(v1=null,v2=null,id=null) {
                this.v1 = v1;
                this.v2 = v2;
                this.id = id;
            }

            isAboveCheck(other) {
                if (this==other) {
                    return false;
                }

                //compared this's x's (left to right)
                let ctx1 = Math.min(this.v1.x,this.v2.x);
                let ctx2 = Math.max(this.v1.x,this.v2.x);

                //compared other's x's (left to right)
                let cox1 = Math.min(other.v1.x,other.v2.x);
                let cox2 = Math.max(other.v1.x,other.v2.x);

                //compared this's y's (top to bottom, 1 to 2)
                let cty1 = Math.min(this.v1.y,this.v2.y);
                let cty2 = Math.max(this.v1.y,this.v2.y);

                //compared other's y's (top to bottom, 1 to 2)
                let coy1 = Math.min(other.v1.y,other.v2.y);
                let coy2 = Math.max(other.v1.y,other.v2.y);

                //if any of the other's vertices are below this edge, then this is above
                //NOTE: REMEMBER Y STARTS FROM TOP TO BOTTOM OF THE CANVAS
                if (coy1>cty1 || coy2>cty1) {
                    if ((cox1>=ctx1 && cox2<=ctx2) || (cox1<=ctx2 && cox2>=ctx2) || (cox2>ctx1 && cox1<ctx1)) {               
                        //console.log(this.id,"is above",other.id);
                        this.isAbove = true;

                        return true;
                    }
                }

                return false;
            }


            isBelowCheck(other) {
                if (this==other) {
                    return false;
                }

                //compared this's x's (left to right)
                let ctx1 = Math.min(this.v1.x,this.v2.x);
                let ctx2 = Math.max(this.v1.x,this.v2.x);

                //compared other's x's (left to right)
                let cox1 = Math.min(other.v1.x,other.v2.x);
                let cox2 = Math.max(other.v1.x,other.v2.x);

                //compared this's y's (top to bottom, 1 to 2)
                let cty1 = Math.min(this.v1.y,this.v2.y);
                let cty2 = Math.max(this.v1.y,this.v2.y);

                //compared other's y's (top to bottom, 1 to 2)
                let coy1 = Math.min(other.v1.y,other.v2.y);
                let coy2 = Math.max(other.v1.y,other.v2.y);

                //if any of the other's vertices are above this edge, then this is below
                //NOTE: REMEMBER Y STARTS FROM TOP TO BOTTOM OF THE CANVAS
                if (coy1<cty2 || coy2<cty2) {
                    if ((cox1>=ctx1 && cox2<=ctx2) || (cox1<=ctx2 && cox2>=ctx2) || (cox2>ctx1 && cox1<ctx1)) {     
                        //console.log(this.id,"is below",other.id);
                        this.isBelow = true;

                        return true;
                    }
                }

                return false;
            }

            isVertical() {
                return (this.v1.x==this.v2.x);
            }
            /**
             * @param {Array} edges 
             */
            setOrientation(edges) {
                this.isAbove = null;
                this.isBelow = null;

                for (let i=0; i<edges.length; i++) {
                    let other = edges[i];
                    if (other==this) {continue;}

                    this.isAboveCheck(other);
                    this.isBelowCheck(other);
                    
                    if (this.isAbove && this.isBelow) {
                        return;
                    }
                }



            }

            getAngleRadians() {
                let dy = Math.max(this.v1.y,this.v2.y)-Math.min(this.v1.y,this.v2.y);
                let dx = Math.max(this.v1.x,this.v2.x)-Math.min(this.v1.x,this.v2.x);
                return Math.atan2(dy,dx);
            }

            withinRange(x,y) {
                if (this.checkType=="above") {
                    if (x>=Math.min(this.v1.x,this.v2.x) && x<=Math.max(this.v1.x,this.v2.x)) {
                        if (y<=this.v1.y && y<=this.v2.y) {
                            return true;
                        }
                    }
                }
                else if (this.checkType=="below") {
                    if (x>=Math.min(this.v1.x,this.v2.x) && x<=Math.max(this.v1.x,this.v2.x)) {
                        if (y>=this.v1.y && y>=this.v2.y) {
                            return true;
                        }
                    }
                }

                return false;
            }

            /**
             * 
             * @param {Array} edges 
             * @returns 
             */
            getEdgesAbove(edges) {
                const above=[];

                for (let i=0; i<edges.length; i++) {
                    let edge = edges[i];
                    if (this.isBelowCheck(edge)) {
                        above.push(edge);
                    }
                }

                return above;
            }

            
            /**
             * 
             * @param {Array} edges 
             * @returns 
             */
            getEdgesBelow(edges) {
                const below=[];

                for (let i=0; i<edges.length; i++) {
                    let edge = edges[i];
                    if (this.isAboveCheck(edge)) {
                        below.push(edge);
                    }
                }

                return below;
            }

        }

        for (let i=0; i<this.vertices.length; i++) {
            let v1 = this.vertices[i];
            let v2 = this.vertices[(i+1)%this.vertices.length];
            edges.push(new Edge(v1,v2,i));
        }

        for (let i=0; i<edges.length; i++) {
            let edge = edges[i];
            let next = edges[(i+1)%edges.length];

            edge.next = next;
            next.pre = edge;
        }
        
        //debug
        //edges.forEach(element => {console.log("pre:",element.pre.id,"me:",element.id,"next:",element.next.id);});
        
        return edges;
    }

    formatEdges() {
        if (!Array.isArray(this.edges)) {return;}
        let start = this.edges[0];

        for (let i=0; i<this.edges.length; i++) {
            let edge = this.edges[i];
            edge.setOrientation(this.edges);
            if ((edge.isAbove && !edge.isBelow) || (!edge.isAbove && edge.isBelow)) {
                start = edge;
                break;
            }
        }

        if ((start.isAbove && start.isBelow) || (!start.isAbove && !start.isBelow)) {
            console.error("failed to format an edge array.")
            return;
        }
        

        if (start.isAbove) {
            start.checkType="below";
        }
        else {
            start.checkType="above";
        }

        let cursor = start;
        let next = cursor.next;
        while (next!=start) {
            if (!next.isVertical()) {
                if (next.isAboveCheck(cursor) || next.isBelowCheck(cursor)) {
                    if (cursor.checkType=="above") {
                        next.checkType="below";
                    }
                    else if (cursor.checkType=="below") {
                        next.checkType="above";
                    }
                }
                else {
                    next.checkType=cursor.checkType;
                }   
            }
            else {
                next.isAbove=true;
                next.isBelow=true;
                next.checkType=cursor.checkType;
            }

            //console.log("e"+cursor.id,cursor.checkType,"->","e"+next.id,next.checkType);
            cursor = cursor.next;
            next = cursor.next;
        }

    }

    draw() {
        this.edges.forEach((edge) => {
            const v1 = edge.v1;
            const v2 = edge.v2;
            let color = "black";

            if (edge.isBelow) {
                color = this.isBelowColor;
            }
            if (edge.isAbove) {
                color = this.isAboveColor;
            }
            if (edge.isAbove && edge.isBelow) {
                color = this.isVerticalColor;
            }

            Draw.line(v1.x,v1.y,v2.x,v2.y,color);
            Draw.text((v1.x+v2.x)/2 , (v1.y+v2.y)/2 ,edge.checkType[0].toUpperCase()+ "e" + edge.id);
            Draw.text((v1.x+v2.x)/2 , (v1.y+v2.y)/2 +8 ,Math.round(edge.getAngleRadians()*180/Math.PI)+"\u00B0",8);
        });

        this.vertices.forEach((v)=> {
            Draw.dot(v.x,v.y,3,v.vertexColor);
            Draw.circumference(v.x,v.y,3);
        });
    }

    drawArea(length = 90) {
        for (let i=0; i<this.edges.length; i++) {
            let edge = this.edges[i];
            if (edge.isVertical()) {continue;}
            let theta = edge.getAngleRadians();
            if (edge.checkType=="above") {
                let p2 = edge.v2;
                let p3 = edge.v1;
                if (edge.v1.x>p2.x) {
                    p2 = edge.v1;
                    p3 = edge.v2;
                }
                let p1 = {
                    x: p2.x+(length*Math.cos(theta+(Math.PI/2))),
                    y: p2.y-(length*Math.sin(theta+(Math.PI/2)))
                }
                let p4= {
                    x: p3.x+(length*Math.cos(theta+(Math.PI/2))),
                    y: p3.y-(length*Math.sin(theta+(Math.PI/2)))
                }
                let color = this.isBelowColor;
                Draw.area([[p1.x,p1.y],[p2.x,p2.y],[p3.x,p3.y],[p4.x,p4.y]],color);
            }
            else if (edge.checkType=="below") {
                let p1 = edge.v2;
                let p4 = edge.v1;
                if (edge.v1.x>p1.x) {
                    p1 = edge.v1;
                    p4 = edge.v2;
                }
                let p2 = {
                    x: p1.x+(length*Math.cos(theta+(Math.PI*3/2))),
                    y: p1.y-(length*Math.sin(theta+(Math.PI*3/2)))
                }
                let p3 = {
                    x: p4.x+(length*Math.cos(theta+(Math.PI*3/2))),
                    y: p4.y-(length*Math.sin(theta+(Math.PI*3/2)))
                }
                let color = this.isAboveColor;
                color.replace()
                Draw.area([[p1.x,p1.y],[p2.x,p2.y],[p3.x,p3.y],[p4.x,p4.y]],color);
            }
        }
    }

    /**
     * @param {MouseEvent} event 
     * @returns 
     */
    isMouseColliding(event) {
        const m = Mouse.getPosition(Draw.canvas,event);
        for (let i=0; i<this.edges.length; i++) {
            let edge = this.edges[i];
            if (edge.withinRange(m.x,m.y)) {
                //console.log("mouse within range of e" + edge.id);

                if (edge.checkType=="above") {
                    const aboves = edge.getEdgesAbove(this.edges);

                    for (let j = 0; j < aboves.length; j++) {
                        const above = aboves[j];
                        if (above.checkType=="below" && above.withinRange(m.x,m.y)) {
                            //console.log("mouse within range of e" + above.id);
                            //console.log("mouse intersects with e"+edge.id,"and","e"+above.id);
                            
                            return true;
                        }
                    }
                }
                else if (edge.checkType=="below") {
                    const belows = edge.getEdgesBelow(this.edges);

                    for (let j = 0; j < belows.length; j++) {
                        const below = belows[j];
                        if (below.checkType=="above" && below.withinRange(m.x,m.y)) {
                            //console.log("mouse within range of e" + below.id);
                            //console.log("mouse intersects with e"+edge.id,"and","e"+below.id);

                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

}





export class BoundaryShape {
    points = null;

    constructor(points){
        if (points==null) {return;}
        this.points = [...points];
    }
}

export class SquareShape extends BoundaryShape {
    constructor(x,y,width,height,originType="center") {
        super();
        let x1 = null;
        let y1 = null;
        switch(originType) {
            case "center":
                x1 = x-(width/2);
                y1 = y-(height/2);
                break;
        }
        let x2 = x1+width;
        let y2 = y1+height;

        this.points = [[x1,y1],[x2,y1],[x2,y2],[x1,y2]];
        
    }
}