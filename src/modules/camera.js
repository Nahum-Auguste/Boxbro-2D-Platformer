import Body from "./bodies/body.js";
import canvas, { ctx } from "./canvas.js";
import Draw from "./draw.js";
import keyboard from "./keyboard.js";
import mouse from "./mouse.js";
import Utils from "./utils.js";
import player from "./world-entities/player.js";

const camera = {
    zoom:1,
    x:-200,
    y:0,
    width:canvas.width,
    height:canvas.height,
    x2:canvas.width,
    y2:canvas.height,
    get_view: ()=>{
        const z = camera.zoom;
        const zf = 1/z;

        const view = {
            x:camera.x,
            y:camera.y,
            x1:camera.x,
            y1:camera.y,
            x2:camera.x+(camera.width),
            y2:camera.y+(camera.height),
            width:camera.width,
            height:camera.height,
        };
        return view;
    },
    handle_camera:handle_camera,
    follow_target:follow_target,
    handle_zoom_controls:handle_zoom_controls,
    set_zoom:(z)=>{
        camera.zoom = z;
    },
    inc_zoom:(z)=>{
        camera.zoom = Utils.clamp(Math.abs(z),camera.zoom+z,3);
    },
    move:(dx=0,dy=0)=>{
        camera.x += dx;//*camera.zoom;
        camera.y += dy;//*camera.zoom;
        if (!mouse.moving) {
            const t = ctx.getTransform();
            let a = t.a;
            let b = t.b;
            let c = t.c;
            let d = t.d;
            let e = t.e;
            let f = t.f;
            //mouse.x = mouse.last_x + dx;
            //mouse.y = mouse.last_y + dy;
        }
    },
    target:undefined,

}
export default camera;

function handle_zoom_controls() {
    const zoom_out = keyboard.is_pressed("o");
    const zoom_in = keyboard.is_pressed("p");
    const zoom_const = .10;
    
    if (zoom_out) {
        camera.inc_zoom(-zoom_const);
    }
    if (zoom_in) {
        camera.inc_zoom(zoom_const);
    }
}

function handle_camera() {
    const debug = !true;
    const t = ctx.getTransform();
    let a = t.a;
    let b = t.b;
    let c = t.c;
    let d = t.d;
    let e = t.e;
    let f = t.f;

    const z = camera.zoom;
    const zf = 1/camera.zoom;

    follow_target(player);
    
    camera.width = canvas.width * zf;
    camera.height = canvas.height * zf;
    camera.x2 = camera.x + camera.width;
    camera.y2 = camera.y + camera.height;
    const view = camera.get_view();

    //edit ctx position
    e = -view.x*z
    f = -view.y*z;

    //edit ctx scale
    a = d = z;


    //set new ctx parameters
    ctx.setTransform(a,b,c,d,e,f);



    if (debug) {
        //draw camera border
        ctx.strokeStyle = "red";
        ctx.lineWidth = 10*zf;
        ctx.strokeRect(camera.x,camera.y,camera.width,camera.height);
        //console.log(box.x);
        
        //draw box border
        ctx.strokeStyle = "magenta"
        ctx.lineWidth = 5*zf;
        ctx.strokeRect(view.x,view.y,view.width,view.height);

        //draw origin line
        Draw.line(0,camera.y,0,camera.y2,"blue",1*zf);
        Draw.line(camera.x,0,camera.x2,0,"blue",1*zf);
    }
}

function follow_target() {
    const target = camera.target;
    if (!target) {return;}
    const debug = true;
    const z = camera.zoom;
    const zf = 1/z;

    const view = camera.get_view();


    const x1range = !mouse.holding(target)? (canvas.width/2)*zf : (canvas.width/4)*zf;
    const x2range = !mouse.holding(target)? (canvas.width/2)*zf : (canvas.width/4)*zf;
    const y1range = !mouse.holding(target)? (canvas.height/2)*zf : (canvas.height/4)*zf;
    const y2range = !mouse.holding(target)? (canvas.height/2)*zf : (canvas.height/4)*zf;
    const bound_color = "cyan";
    const bound_color2 = "orange";

    const bx1 = view.x + x1range;
    const bx2 = view.x2 - x2range;
    const by1 = view.y + y1range;
    const by2 = view.y2 - y2range;

    if (mouse.holding(target)) {
        //target = mouse;
        //follow_target(mouse);
        //return;
    }

    const tp = target instanceof Body? target.collision_area.get_midpoint(): {x:target.x,y:target.y};
    const tx = tp.x;
    const ty = tp.y;

    //draw target origin line
    if (!debug) {
        Draw.line(tx,view.y,tx,view.y2,"pink",2*zf);//vertical
        Draw.line(view.x,ty,view.x2,ty,"pink",2*zf);//horizontal

        //draw left boundary
        Draw.line(bx1,view.y,bx1,view.y2,bound_color,1*zf);//vertical
        //draw right boundary
        Draw.line(bx2,view.y,bx2,view.y2,bound_color2,1*zf);//vertical
        //draw top boundary
        Draw.line(view.x,by1,view.x2,by1,bound_color,1*zf);//horizontal
        //draw bottom boundary
        Draw.line(view.x,by2,view.x2,by2,bound_color2,1*zf);//horizontal
    }

    //follow constant
    const xfc = .1;
    const yfc = .2;
    const cfs = 7;

    if (tx>bx2) {
        const xfs = !mouse.holding(target)? (tx-bx2)*xfc: cfs;
        camera.move(xfs);
    }
    if (tx<bx1) {
        const xfs = !mouse.holding(target)? (tx-bx1)*xfc: -cfs;
        camera.move(xfs);
    }

    if (ty>by2) {
        const yfs = !mouse.holding(target)? (ty-by2)*yfc: cfs;
        //camera.move(0,yfs);
    }
    if (ty<by1) {
        const yfs = !mouse.holding(target)? (ty-by1)*yfc: -cfs;
        //camera.move(0,yfs);
    }


}


