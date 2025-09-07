import canvas from "../canvas.js";

const mouse = {
    x:undefined,
    y:undefined,
    down:false,
    up:true,
    /**@type {HeldObjData[]} */
    held_obj_data: [],
    is_holding: (obj,options={})=> {
        for (let i=0; i<mouse.held_obj_data.length; i++) {
            const d = mouse.held_obj_data[i];
            if (d.obj==obj) {
                return i;
            }
        }
        return -1;
    },
    find_held_data:(obj)=>{
        for (let i=0; i<mouse.held_obj_data.length; i++) {
            const d = mouse.held_obj_data[i];
            if (d.obj==obj) {
                return d;
            }
        }
        return false;
    },
    hold:(obj)=>{
        if (mouse.is_holding(obj)==-1){
            //console.log(mouse.is_holding(obj));
            
            mouse.held_obj_data.push(new HeldObjData(obj));
        }
    },
    get_position: ()=>{return {x:mouse.x,y:mouse.y}},
    set_position: (x,y)=>{mouse.x=x;mouse.y=y;},
    move_object: (obj)=>{
        const d = mouse.find_held_data(obj);
        if (!d) {
            mouse.held_obj_data.push(new HeldObjData(obj));
        }
        else {
            //console.log(d.dx,d.dy);
            
            const dx = d.dx;
            const dy = d.dy;
            obj.x = mouse.x-dx;
            obj.y = mouse.y-dy;
        }
    },

}
export default mouse;

addEventListener("mousemove",e=>{
    mouse.set_position(
        e.clientX - canvas.getBoundingClientRect().x, 
        e.clientY - canvas.getBoundingClientRect().y
    );
})

addEventListener("mouseup",e=>{
    mouse.up = true;
    mouse.down = false;
    mouse.held_obj_data = [];
});

addEventListener("mousedown",e=>{
    mouse.down = true;
    mouse.up = false;
});

class HeldObjData {
    obj;
    dx;
    dy;


    constructor(obj) {
        this.obj = obj;
        this.dx = mouse.x-obj.x;
        this.dy = mouse.y-obj.y;
    }

}