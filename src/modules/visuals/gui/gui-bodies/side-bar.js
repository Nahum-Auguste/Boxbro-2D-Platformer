import canvas from "../../../canvas.js";
import CollisionArea from "../../../collision/collision-area.js";
import RectShape from "../../../geometry/shapes/rect-shape.js";
import mouse from "../../../mouse.js";
import DebugBlock1 from "../../../world-entities/debug-block-1.js";
import Player from "../../../world-entities/player.js";
import Drawing from "../../drawing.js";
import GuiButton from "../gui-button.js";
import Gui from "../gui.js";


class SideBar extends Gui{
    collapsed_width = 15;
    width = this.collapsed_width;
    height = canvas.height;
    open_width = this.collapsed_width + 200;
    x = canvas.width - this.collapsed_width;
    y = 0;

    handle_width = 7;
    handle_height = 100;

    collapsed = !true;


    /**@type {GuiButton} */
    handle;

    button_width = 40;
    button_height = this.button_width;

    constructor() {
        const color = "rgba(44, 44, 44, 1)";
        super(0,0);

        const open_drawing = new Drawing(new RectShape(this.open_width,this.height),color);
        const drawing = new Drawing(new RectShape(this.collapsed_width,this.height),"black",[open_drawing]);
        this.drawing = drawing;


        const handle_shape = new RectShape(this.handle_width,this.handle_height)
        const handle_ca = new CollisionArea(0,0,handle_shape);
        const handle_color = "rgba(90, 90, 90, 1)";
        const handle = new GuiButton(this.handle_x,this.handle_y,handle_ca,new Drawing(handle_shape,handle_color),"handle");
        handle.hovered_drawing = new Drawing(handle_shape,"rgba(122, 122, 122, 1)");
        handle.clicked_drawing = new Drawing(handle_shape,"rgba(196, 196, 196, 1)");
        handle.on_click = ()=>{
            if (this.collapsed) {
                this.open();
            }
            else {
                this.collapse();
            }
        }
        this.handle = handle;
        this.buttons.push(handle);

        const bodies = [
            Player,
            DebugBlock1
        ]

        bodies.forEach(c=>{
            const w = this.button_width;
            const h = this.button_height;
            const shape = new RectShape(w,h)
            const ca = new CollisionArea(0,0,shape)
            const drawing = new Drawing(shape,"grey");
            const button = new GuiButton(0,0,ca,drawing);
            button.clicked_drawing = new Drawing(shape,"lightgray");
            button.name = c.name;
            button.on_click = ()=>{
                mouse.will_create = c;
            };
            this.buttons.push(button);
        })
    }

    loop() {
        this.width = this.collapsed? this.collapsed_width : this.open_width;
        this.x = canvas.width - this.width;
        super.loop();
        this.handle.x = this.collapsed_width/2 - this.handle_width/2
        this.handle.y = this.height/2  - this.handle_height/2;
        
        const buttons = this.buttons.filter(b=>{
            return b.name != "handle";
        });
        buttons.forEach((b,i)=>{
            const margin_left = 10;
            const margin_top = 10;
            const row = 0;
            const x = this.collapsed_width + margin_left * (i+1) + this.button_width * i;
            const y = margin_top + this.button_height*row;
            b.x = x;
            b.y = y;

        });
    }

    collapse() {
        this.collapsed = true;
        this.width = this.collapsed_width;
        this.x = canvas.width - this.width;
    }

    open() {
        this.collapsed = false;
        this.width = this.open_width;
        this.x = canvas.width - this.width;
    }
}
const sidebar = new SideBar();
export default sidebar;