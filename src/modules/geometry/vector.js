
export default class Vector {
    x=0;
    y=0;

    constructor(x=0,y=0) {
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
}