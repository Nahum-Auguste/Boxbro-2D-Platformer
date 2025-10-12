import camera from "../../camera.js";
import Drawing from "../drawing.js";
import GuiButton from "./gui-button.js";
import GuiObject from "./gui-object.js";


export default class Gui extends GuiObject {
    /**@type {GuiButton[]} */
    buttons = [];

    x;y;

    /**@type {Drawing} */
    drawing;

    constructor(x,y) {
        super();
        this.x = x;
        this.y = y;
    }

    loop() {
        const z = camera.zoom;
        const zf = 1/z;
        const view = camera.get_view();
        const x = view.x + this.x*zf;
        const y = view.y + this.y*zf;

        this.fix_points();
    }

    draw() {
        const z = camera.zoom;
        const zf = 1/z;
        const view = camera.get_view();
        const x = view.x + this.x*zf;
        const y = view.y + this.y*zf;

        if (this.drawing) {
            this.drawing.draw(x,y);
        }

        this.buttons.forEach(b => {
            b.loop();
            b.draw(x,y);
        });
    }

    fix_points() {
        const z = camera.zoom;
        const zf = 1/z;
        if (this.drawing) {
            this.drawing.offset_points.forEach((p,i,arr)=>{
                const bp = this.drawing.base_offset_points[i];
                p.x = bp.x * zf;
                p.y = bp.y * zf;
            });
            this.drawing.layers.forEach(l=>{
                const drawing = l;

                drawing.offset_points.forEach((p,i,arr)=>{
                    const bp = drawing.base_offset_points[i];
                    p.x = bp.x * zf;
                    p.y = bp.y * zf;
                });
            })
        }
    }

    handle_debug_mode() {
        this.buttons.forEach(b => {
            b.handle_debug_mode();
        });
    }
}