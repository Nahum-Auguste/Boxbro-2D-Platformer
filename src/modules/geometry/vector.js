import * as Draw from "../draw.js"

export default class Vector {
    x=0;
    y=0;

    constructor(x,y) {
        this.x=x;
        this.y=y;
    }

    normalize() {
        if (this.x==0 && this.y==0) {return;}
        const x = this.x;
        const y = this.y;
        const magnitude = Math.sqrt(x*x + y*y);
        this.x *= Math.abs(x/magnitude);
        this.y *= Math.abs(y/magnitude);
    }

    /**
     * 
     * @param {Vector} vector 
     */
    add(vector) {
        return new Vector(this.x+vector.x,this.y+vector.y);
    }
    subtract(vector) {
        return new Vector(this.x-vector.x,this.y-vector.y);
    }
    scale(scale) {
        return new Vector(this.x*scale,this.y*scale);
    }
    dot(vector) {
        return this.x*vector.x + this.y*vector.y;
    }
    length() {
        return this.magnitude();
    }
    magnitude() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    draw(x,y,color="purple",lineWidth=2) {
        Draw.line(x,y,x+this.x,y+this.y,color,lineWidth);
    }
    unit() {
        const mag = this.magnitude();
        return new Vector(this.x/mag,this.y/mag);
    }
}