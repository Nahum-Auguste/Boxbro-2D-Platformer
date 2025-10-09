export default class Vector {
    /**@type {Number} */
    x;
    /**@type {Number} */
    y;
    constructor(x,y) {
        this.x=x;
        this.y=y;
    }
    get_magnitude() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    normalized() {
        const m = this.get_magnitude();

        if (m==0) {return new Vector(0,0);}

        return new Vector(this.x*Math.abs((this.x/m)),this.y*Math.abs((this.y/m)));
    }
    clear() {
        this.x = 0;
        this.y = 0;

        return this;
    }
    /**@type {Vector} */
    add(vec) {
        this.x+=vec.x;
        this.y+=vec.y;

        return this;
    }
    scale(val) {
        this.x*=val;
        this.y*=val;

        return this;
    }
    copy() {
        return new Vector(this.x,this.y);
    }
}