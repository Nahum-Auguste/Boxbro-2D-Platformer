import canvas from "../../../canvas.js";
import CollisionArea from "../../../collision/collision-area.js";
import RectShape from "../../../geometry/shapes/rect-shape.js";
import mouse, { SavedState } from "../../../mouse.js";
import Drawing from "../../drawing.js";
import GuiButton from "../gui-button.js";
import Gui from "../gui.js";


class MenuBar extends Gui{

    button_width = 50;
    button_height = this.button_width;
    margin_top = 10;
    margin_left = 10

    constructor(x=0,y=0) {
        super(x,y);

        this.drawing = new Drawing(new RectShape(canvas.width,this.margin_top+this.button_height+this.margin_top),"grey")


        const shape = new RectShape(this.button_width,this.button_height);
        let drawing = new Drawing(shape,"rgba(11, 11, 11, 0.76)");
        let hovered_drawing = new Drawing(shape,"rgba(51, 51, 51, 0.76)");
        let clicked_drawing = new Drawing(shape,"rgba(134, 134, 134, 0.76)");
        let ca = new CollisionArea(0,0,shape)

        const create_button = new GuiButton(0,0,ca,drawing,"create block");
        create_button.hovered_drawing = hovered_drawing;
        create_button.clicked_drawing = clicked_drawing;
        this.buttons.push(create_button);
        create_button.on_click = ()=> {
            if (mouse.mode!="create") {
                mouse.mode = "create";
            }
            else {
                mouse.mode = undefined;
            }
        }

        const delete_button = new GuiButton(0,0,ca,drawing,"delete block");
        delete_button.hovered_drawing = hovered_drawing;
        delete_button.clicked_drawing = clicked_drawing;
        this.buttons.push(delete_button);
        delete_button.on_click = ()=> {
            if (mouse.mode!="delete") {
                mouse.mode = "delete";
            }
            else {
                mouse.mode = undefined;
            }
        }

        const undo_button = new GuiButton(0,0,ca,drawing,"undo");
        undo_button.hovered_drawing = hovered_drawing;
        undo_button.clicked_drawing = clicked_drawing;
        this.buttons.push(undo_button);
        undo_button.on_click = ()=> {
            SavedState.undo();
        }

        const redo_button = new GuiButton(0,0,ca,drawing,"redo");
        redo_button.hovered_drawing = hovered_drawing;
        redo_button.clicked_drawing = clicked_drawing;
        this.buttons.push(redo_button);
        redo_button.on_click = ()=> {
            SavedState.redo();
        }

        


    }

    loop() {
        super.loop();

        this.buttons.forEach((b,i)=>{
            const margin_top = this.margin_top;
            const margin_left = this.margin_left;
            let x = margin_left*(i+1) + this.button_width*i;
            let y = margin_top;
            b.x = x;
            b.y = y;
        });
    }

}
const menubar = new MenuBar();
export default menubar;
