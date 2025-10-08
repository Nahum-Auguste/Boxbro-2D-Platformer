import canvas from "./canvas.js";

const mouse = {
    /**@type {Number} */
    x:undefined,
    /**@type {Number} */
    y:undefined,
    hovered:null,
    held:[],
    held_data_arr:[],
    down:false,
    up:true,
    holding:(obj,get_index=false)=>{
        if (!get_index) {
            return mouse.held.includes(obj);
        }
        else {
            return mouse.held.indexOf(obj);
        }
    },
    move_obj:(obj)=>{
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
}
export default mouse;

addEventListener("mousemove",(e)=>{
    const canvas_box = canvas.getBoundingClientRect();
    const offx = -10;
    const offy = -10;
    mouse.x = e.clientX - canvas_box.x + offx;
    mouse.y = e.clientY - canvas_box.y + offy;
    
    if (mouse.down && mouse.held.length==0 && mouse.hovered) {
        mouse.held.push(mouse.hovered);
        mouse.held_data_arr.push(new HeldData(mouse.hovered));
    }
});

addEventListener("mousedown",e=>{
    mouse.down = true;
    mouse.up = false;

    if (mouse.down && mouse.held.length==0 && mouse.hovered) {
        mouse.held.push(mouse.hovered);
        mouse.held_data_arr.push(new HeldData(mouse.hovered));
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