import { body } from "../main.js";
import Body from "./bodies/body.js";
import KineticBody from "./bodies/kinetic-body.js";
import StaticBody from "./bodies/static-body.js";
import canvas, { ctx } from "./canvas.js";

const mouse = {
    /**@type {Number} */
    x:undefined,
    /**@type {Number} */
    y:undefined,
    hovered:null,
    clicked:null,
    grabbing:false,
    held:[],
    held_data_arr:[],
    clicked_lifetimer:9,
    clicked_lifetime:0,
    mode:undefined,
    down:false,
    up:true,
    /**@type {Number} */
    last_x:undefined,
    /**@type {Number} */
    last_y:undefined,
    holding:(obj,get_index=false)=>{
        if (!get_index) {
            return mouse.held.includes(obj);
        }
        else {
            return mouse.held.indexOf(obj);
        }
    },
    move_obj:(obj)=>{
        mouse.grabbing = true;
        let idx = mouse.holding(obj,true);
        if (idx==-1) {
            mouse.held.push(obj);
            mouse.held_data_arr.push(new HeldData(obj));
            idx = mouse.held.length-1;
        }

        const data = mouse.held_data_arr[idx];
        //console.log(data);
        
        const dx = data.dx;
        const dy = data.dy;
        obj.x = mouse.x-dx;
        obj.y = mouse.y-dy;
    },
    moving:false,
    handle_mouse:handle_mouse,
}
export default mouse;

function handle_mouse() {
    if (mouse.clicked) {
        mouse.clicked_lifetime++;
    }
    if (mouse.clicked_lifetime>=mouse.clicked_lifetimer) {
        mouse.clicked_lifetime = 0;
        mouse.clicked = null;
    }
    
    if (mouse.clicked) {
        body.style.cursor = 'pointer';
    }
    else if (mouse.grabbing) {
        body.style.cursor = 'grab';
    }
    else if (mouse.hovered) {
        body.style.cursor = 'pointer';
    }
    else {
        body.style.cursor = 'auto';
    }

    switch (mouse.mode) {
        case "delete":
            body.style.cursor = "not-allowed";
            break;

        default:
            break;
    }

    if (mouse.mode=="delete" && mouse.held.length>0) {
        console.log(mouse.held);
        
        mouse.held.forEach(h=>{
            let type;

            type = Body;
            if (h instanceof type) {
                let idx = type.get_entity_list().indexOf(h);
                if (idx>=0) {
                    type.get_entity_list().splice(idx,1);
                    mouse.hovered = null;
                }
            }
            type = StaticBody;
            if (h instanceof type) {
                let idx = type.get_entity_list().indexOf(h);
                if (idx>=0) {
                    type.get_entity_list().splice(idx,1);
                    mouse.hovered = null;
                }
            }
            type = KineticBody;
            if (h instanceof type) {
                let idx = type.get_entity_list().indexOf(h);
                if (idx>=0) {
                    type.get_entity_list().splice(idx,1);
                    mouse.hovered = null;
                }
            }
        });
    }


    mouse.moving = false;
    mouse.grabbing = false;
}

addEventListener("mousemove",(e)=>{
    const canvas_box = canvas.getBoundingClientRect();
    const offx = -10;
    const offy = -10;
    mouse.x = (e.clientX - canvas_box.x + offx - ctx.getTransform().e)/ctx.getTransform().a;
    mouse.y = (e.clientY - canvas_box.y + offy - ctx.getTransform().f)/ctx.getTransform().d;
    mouse.last_x = mouse.x;
    mouse.last_y = mouse.y;
    
    if (mouse.down && mouse.held.length==0 && mouse.hovered) {
        mouse.held.push(mouse.hovered);
        mouse.held_data_arr.push(new HeldData(mouse.hovered));
    }
    mouse.moving = true;
});

addEventListener("mousedown",e=>{
    
    mouse.down = true;
    mouse.up = false;

    if (mouse.down && mouse.held.length==0 && mouse.hovered) {
        mouse.held.push(mouse.hovered);
        mouse.held_data_arr.push(new HeldData(mouse.hovered));
    }
    
    if (!mouse.clicked) {
        mouse.clicked=mouse.hovered;
    }

})

addEventListener("mouseup",e=>{
    mouse.up = true;
    mouse.down = false;
    mouse.held = [];
    mouse.held_data_arr = [];
})

class HeldData {
    obj;
    dx;
    dy;
    constructor(obj) {
        this.obj = obj;
        this.dx = mouse.x-obj.x,
        this.dy = mouse.y-obj.y
    }
}