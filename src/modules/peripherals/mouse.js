import canvas from "../canvas.js";

const mouse = {
    x:undefined,
    y:undefined,
    get_position: ()=>{return {x:mouse.x,y:mouse.y}},
    set_position: (x,y)=>{mouse.x=x;mouse.y=y;}

}
export default mouse;

addEventListener("mousemove",e=>{
    mouse.set_position(
        e.clientX - canvas.getBoundingClientRect().x, 
        e.clientY - canvas.getBoundingClientRect().y
    );
    
})