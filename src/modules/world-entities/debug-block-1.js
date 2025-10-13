import StaticBody from "../bodies/static-body.js";
import CollisionArea from "../collision/collision-area.js";
import RectShape from "../geometry/shapes/rect-shape.js";


export default class DebugBlock1 extends StaticBody {

    constructor(x,y) {
        

        const w = 370;
        const h = 150;
        const cx = x //- w/2;
        const cy = y //- h/2;
        const rect = new RectShape(w,h);
        const ca = new CollisionArea(cx,cy,rect);
        super(x,y,ca);
    }
}