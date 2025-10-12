import canvas from "../../canvas.js";
import CollisionArea from "../../collision/collision-area.js";
import RectShape from "../../geometry/shapes/rect-shape.js";
import mouse from "../../mouse.js";
import Drawing from "../drawing.js";
import GuiButton from "./gui-button.js";
import Gui from "./gui.js";


export default class MenuBar extends Gui{

    constructor(x=0,y=0) {
        super(x,y);
        const bw = 50;
        const bh = 50;
        const shape = new RectShape(bw,bh);
        const margin_right = 10 + bw;
        const margin_top = 10;
        const margin_left = 10;
        let bx = x + margin_left;
        let by = y + margin_top;

        let drawing = new Drawing(shape,"rgba(11, 11, 11, 0.76)");
        let hovered_drawing = new Drawing(shape,"rgba(51, 51, 51, 0.76)");
        let clicked_drawing = new Drawing(shape,"rgba(134, 134, 134, 0.76)");

        let ca = new CollisionArea(bx,by,shape)
        const add_button = new GuiButton(bx,by,ca,drawing,"add block");
        add_button.hovered_drawing = hovered_drawing;
        add_button.clicked_drawing = clicked_drawing;
        this.buttons.push(add_button);

        bx += margin_right;
        ca = new CollisionArea(bx,by,shape)
        const delete_button = new GuiButton(bx,by,ca,drawing,"delete block");
        delete_button.hovered_drawing = hovered_drawing;
        delete_button.clicked_drawing = clicked_drawing;
        delete_button.on_click = ()=> {
            mouse.mode = "delete";
        }
        this.buttons.push(delete_button);

        this.drawing = new Drawing(new RectShape(canvas.width,margin_top+bh+margin_top),"grey")
        
    }

}