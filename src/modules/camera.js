import canvas, { ctx } from "./canvas.js";
import Draw from "./draw.js";
import Utils from "./utils.js";


const camera = {
    get_box:()=>{
        return {
            x:-ctx.getTransform().e/ctx.getTransform().a,
            y:-ctx.getTransform().f/ctx.getTransform().d,
            width:(canvas.width)/ctx.getTransform().a,
            height:(canvas.height)/ctx.getTransform().d,
        }
    },
    get_width:()=>camera.w,
    get_height:()=>camera.h,
    draw_border:()=>{
        const box = camera.get_box();
        const x1 = box.x;//-x origin / x scaling
        const y1 = box.y;//-y origin / y scaling
        const x2 = x1 + box.width;
        const y2 = y1 + box.height;
        const w = 5;
        const c = "gold";
        //console.log(x1,y1,x2,y2,w,c,box.width,box.height);
        Draw.line(x1,y1,x2,y1,w,c);
        Draw.line(x2,y1,x2,y2,w,c);
        Draw.line(x2,y2,x1,y2,w,c);
        Draw.line(x1,y2,x1,y1,w,c);
    },
    init:()=>{
        //ctx.setTransform(1,0,0,1,200,0);
        //ctx.setTransform(1/2,0,0,1/2,100,100);
        //console.log(ctx.getTransform());
        //console.log(ctx.getTransform().a);
    },
    move:(dx,dy)=>{
        ctx.translate(dx,dy);
    },
    zoom:(inc)=>{
        const a = ctx.getTransform().a + inc;
        const b = ctx.getTransform().b;
        const c = ctx.getTransform().c;
        const d = ctx.getTransform().d + inc;
        const e = ctx.getTransform().e;
        const f = ctx.getTransform().f;
        const min = 0.2;
        ctx.setTransform(Utils.clamp(min,a,a),b,c,Utils.clamp(min,d,d),e,f);
    },
    get_zoom:()=>{return ctx.getTransform().a;},
    zoom_changed:false,
    zoom_text_life_timer:100,
    zoom_text_life_time:0,
}

export default camera;