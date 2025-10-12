import camera from "../../camera.js";
import { ctx } from "../../canvas.js";
import Draw from "../../draw.js";


const gui_surface = {
    x:0,
    y:0,
    handle_gui_surface:handle_gui_surface,
}
export default gui_surface;

function handle_gui_surface() {
    const debug = true;
    const z = camera.zoom;
    const zf = 1/z;
    const view = camera.get_view();

    const g = gui_surface;
    g.x = view.x;
    g.y = view.y;
    const gx = g.x;
    const gy = g.y;

    if (debug) {
        Draw.line(gx,view.y,gx,view.y2,"rgba(23, 228, 132, 1)",5*zf);
        Draw.line(gx+5*zf,view.y,gx+5*zf,view.y2,"rgba(0, 0, 0, 1)",1*zf);
        ctx.fillStyle = "rgba(0, 0, 0, 0.38)"
        ctx.fillRect(gx+10,gy,50,50)
    }
}