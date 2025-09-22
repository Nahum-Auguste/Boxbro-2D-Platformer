import Draw from "../draw.js";

export default class Vector {
    x;
    y;
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
    abs() {
        return new Vector(Math.abs(this.x),Math.abs(this.y));
    }
    add(vec) {
        this.x+=vec.x;
        this.y+=vec.y;
        return this;
    }
    added_to(vec) {
        return this.copy().add(vec);
    }
    copy() {
        return new Vector(this.x,this.y);
    }
    clear() {
        this.x=0;
        this.y=0;
    }
    dot(vector) {
        return this.x*vector.x + this.y*vector.y;
    }
    magnitude() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    normalize() {
        const m = this.magnitude();
        this.x /= m;
        this.y /= m;
        return this;
    }
    normalized() {
        return this.copy().normalize();
    }
    draw(x,y,color="blue",width=1.5) {
        Draw.line(x,y,x+this.x,y+this.y,width,color);
    }
    scale(f) {
        this.x *=f;
        this.y *=f;
        return this;
    }
    scaled(f) {
        return this.copy().scale(f);
    }
    /**
     * 
     * @param {Vector} v 
     */
    projection_on(v) {
        return v.scaled(this.dot(v)/Math.pow(v.magnitude(),2));
    }
}