import canvas from "./canvas.js";

const mouse = {
    /**@type {Number} */
    x:undefined,
    /**@type {Number} */
    y:undefined,
    hovered:null,
    held:null,
    held_data:undefined,
    down:false,
    up:true,
    move_obj:(obj)=>{
        if (mouse.held_data==undefined && mouse.held==obj) {
            mouse.held_data = {
                dx:mouse.x-obj.x,
                dy:mouse.y-obj.y
            }
        }
        const dx = mouse.held_data.dx;
        const dy = mouse.held_data.dy;
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
    
    if (mouse.down && mouse.held==null) {
        mouse.held = mouse.hovered;
    }
});

addEventListener("mousedown",e=>{
    mouse.down = true;
    mouse.up = false;

    if (mouse.down && mouse.held==null) {
        mouse.held = mouse.hovered;
    }
})

addEventListener("mouseup",e=>{
    mouse.up = true;
    mouse.down = false;
    mouse.held = null;
    mouse.held_data= undefined;
})