import { body } from "../main.js";
import Body from "./bodies/body.js";
import KineticBody from "./bodies/kinetic-body.js";
import StaticBody from "./bodies/static-body.js";
import canvas, { ctx } from "./canvas.js";
import Draw from "./draw.js";
import Point from "./geometry/point.js";
import Utils from "./utils.js";

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
    clicked_lifetimer:2,
    clicked_lifetime:0,
    mode:undefined,
    default_mode:"move",
    down:false,
    up:true,
    will_create:undefined,
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
        if (mouse.mode!=="move") {return;}
        mouse.grabbing = true;
        let idx = mouse.holding(obj,true);
        const hd = new HeldData(obj);
        if (idx==-1) {
            mouse.held.push(obj);
            mouse.held_data_arr.push(hd);
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
        case "create":
            body.style.cursor = "crosshair";
            if (mouse.will_create) {
                Draw.text("Create " + mouse.will_create.name,mouse.x,mouse.y-15)
            }
            else {
                Draw.text("Create Nothing",mouse.x,mouse.y-15)
            }
            break;

        default:
            mouse.mode = mouse.default_mode;
            break;
    }

    if (mouse.mode=="delete" && mouse.held.length>0) {
        let data = [];
        
        mouse.held.forEach(h=>{
            let type;
            let deleted = false;
            let held_data = new HeldData(h);

            type = Body;
            if (h instanceof type) {
                let idx = type.get_entity_list().indexOf(h);
                if (idx>=0) {
                    type.get_entity_list().splice(idx,1);
                    mouse.hovered = null;
                    deleted = true;
                }
            }
            type = StaticBody;
            if (h instanceof type) {
                let idx = type.get_entity_list().indexOf(h);
                if (idx>=0) {
                    type.get_entity_list().splice(idx,1);
                    mouse.hovered = null;
                    deleted = true;
                }
            }
            type = KineticBody;
            if (h instanceof type) {
                let idx = type.get_entity_list().indexOf(h);
                if (idx>=0) {
                    type.get_entity_list().splice(idx,1);
                    mouse.hovered = null;
                    deleted = true;
                }
            }

            //save the state
            if (deleted) {
                data.push(held_data);
            }
        });

        if (data.length>0) {
            new SavedState(data,"delete")
            //console.log(SavedState.get_buffer());
        }
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

    if (mouse.held.length>0 && mouse.mode=="move") {
        let data = [];

        mouse.held.forEach(h=>{
            if (!(h instanceof Body) && !(h instanceof Point)) {return;}
            //console.log(h);
            
            const hd = new HeldData(h);
            
            data.push(hd);
        })

        //console.log("data",data);
        
        if (data.length>0) {
            new SavedState(data,"move");
        }
    }
    if (mouse.mode=="create" && mouse.will_create) {
        const c = new mouse.will_create(mouse.x,mouse.y);

        new SavedState(new HeldData(c),"create");
    }

})

addEventListener("mouseup",e=>{
    if (mouse.held.length>0 && mouse.mode=="move") {
        let data = [];

        const pss = SavedState.get_buffer().at(-1);
        //console.log(pss);

        //console.log(pss.held_data.length,mouse.held.length);
        //console.log(pss.held_data);
        //console.log(mouse.held);
        
        let persist = false;
        if (pss) {
            mouse.held.forEach((h,i)=>{
                if (persist) {return;}
                const phd = pss.held_data[i];
                const hd = new HeldData(h);
                const ox = phd.x;
                const oy = phd.y;
                const nx = hd.x;
                const ny = hd.y;

                if (ox!=nx || oy!=ny) {
                    persist = true;
                }
            })

            if (!persist) {
                SavedState.get_buffer().pop();
                SavedState.inc_buffer(-1);
            }

            //console.log(SavedState.get_buffer());
        }
    }

    mouse.up = true;
    mouse.down = false;
    mouse.held = [];
    mouse.held_data_arr = [];
})

export class HeldData {
    obj;
    x;
    y;
    new_x;
    new_y;
    dx;
    dy;
    body_idx;
    static_body_idx;
    kinetic_body_idx;
    /**@param {Body} obj */
    constructor(obj) {
        this.obj = obj;
        this.x = obj.x;
        this.y = obj.y;
        this.dx = mouse.x-obj.x,
        this.dy = mouse.y-obj.y
        if (obj instanceof Body) {
            this.body_idx = Body.get_entity_list().indexOf(obj);
        }
        if (obj instanceof StaticBody) {
            this.static_body_idx = StaticBody.get_entity_list().indexOf(obj);
        }
        if (obj instanceof KineticBody) {
            this.kinetic_body_idx = KineticBody.get_entity_list().indexOf(obj);
        }
    }
}

export class SavedState {
    /**@type {SavedState[]} */
    static #buffer = [];

    static #buffer_idx = 0;

    /**@type {HeldData[]} */
    held_data = []

    type;

    /**
     * 
     * @param {HeldData[]} held_datas 
     * @param {*} type 
     */
    constructor(held_datas,type) {
        this.type = type;

        if (!Array.isArray(held_datas)) {
            this.held_data = [held_datas];
        }
        else {
            this.held_data = held_datas;
        }
        
        SavedState.#buffer.splice(SavedState.#buffer_idx,0,this);
        SavedState.#buffer_idx++;
        SavedState.#buffer.splice(SavedState.#buffer_idx);
        //console.log(SavedState.#buffer);
        
    }

    static get_buffer() {
        return SavedState.#buffer;
    }

    static inc_buffer(i) {
        SavedState.#buffer_idx = Utils.clamp(0,this.#buffer_idx+i,this.#buffer.length);
    }

    static redo() {
        //console.log(this.#buffer);
        //console.log(this.#buffer_idx);
        if (this.#buffer.length==0 || this.#buffer_idx>=this.#buffer.length) {return;}
        SavedState.#buffer[SavedState.#buffer_idx].redo();
        SavedState.#buffer_idx = Utils.clamp(0,this.#buffer_idx+1,this.#buffer.length);
        //console.log(this.#buffer_idx);
    }

    static undo() {
        //console.log(this.#buffer);
        //console.log(this.#buffer_idx);
        if (this.#buffer.length==0 || this.#buffer_idx<=0) {return;}
        SavedState.#buffer_idx = Utils.clamp(0,this.#buffer_idx-1,this.#buffer.length);
        SavedState.#buffer[SavedState.#buffer_idx].undo();
        //console.log(this.#buffer_idx);
    }

    undo() {
        
        switch(this.type) {
            case "delete":
                console.log("delete undone");
                this.held_data.forEach(hd=>{
                    if (hd.body_idx) {
                        Body.get_entity_list().splice(hd.body_idx,0,hd.obj);
                    }
                    if (hd.static_body_idx) {
                        StaticBody.get_entity_list().splice(hd.static_body_idx,0,hd.obj);
                    }
                    if (hd.kinetic_body_idx) {
                        KineticBody.get_entity_list().splice(hd.kinetic_body_idx,0,hd.obj);
                    }
                });
                break;
            case "move":
                console.log("move undone");
                this.held_data.forEach(hd=>{
                    //console.log(hd.obj);
                    //console.log(hd.x,hd.y);
                    hd.new_x = hd.obj.x;
                    hd.new_y = hd.obj.y;
                    
                    hd.obj.x = hd.x;
                    hd.obj.y = hd.y;
                });
                break;
            case "create":
                console.log("create undone");
                this.held_data.forEach(hd=>{
                    if (hd.body_idx) {
                        Body.get_entity_list().splice(hd.body_idx,1);
                    }
                    if (hd.static_body_idx) {
                        StaticBody.get_entity_list().splice(hd.static_body_idx,1);
                    }
                    if (hd.kinetic_body_idx) {
                        KineticBody.get_entity_list().splice(hd.kinetic_body_idx,1);
                    }
                });
                break;
                
            default:
                break;
        }
    }
    redo() {
        switch(this.type) {
            case "delete":
                console.log("delete redone");
                this.held_data.forEach(hd=>{
                    if (hd.body_idx) {
                        Body.get_entity_list().splice(hd.body_idx,1);
                    }
                    if (hd.static_body_idx) {
                        StaticBody.get_entity_list().splice(hd.static_body_idx,1);
                    }
                    if (hd.kinetic_body_idx) {
                        KineticBody.get_entity_list().splice(hd.kinetic_body_idx,1);
                    }
                });
                break;
            case "move":
                console.log("move redone");
                this.held_data.forEach(hd=>{
                    //console.log(hd.obj);
                    //console.log(hd.x,hd.y);
                    
                    hd.obj.x = hd.new_x;
                    hd.obj.y = hd.new_y;
                });
                break;
            case "create":
                console.log("create redone");
                this.held_data.forEach(hd=>{
                    if (hd.body_idx) {
                        Body.get_entity_list().splice(hd.body_idx,0,hd.obj);
                    }
                    if (hd.static_body_idx) {
                        StaticBody.get_entity_list().splice(hd.static_body_idx,0,hd.obj);
                    }
                    if (hd.kinetic_body_idx) {
                        KineticBody.get_entity_list().splice(hd.kinetic_body_idx,0,hd.obj);
                    }
                });
            default:
                break;
        }
    }
}
