import Draw from "./modules/draw.js";
import canvas from "./modules/canvas.js";
import {ctx} from "./modules/canvas.js";
import mouse from "./modules/peripherals/mouse.js";
import keyboard from "./modules/peripherals/keyboard.js";
import Geometry from "./modules/geometry/geometry.js";


// Document Variables
const body = document.getElementsByTagName("body")[0];
const sky_color = "rgba(255, 255, 255, 1)";


// Debugging Variables
const debug_mode = true;
const debug_array = [];

//50,50,100,50 (h l->r)
//100,50,50,50 (h r->l)
//50,50,100,100 (diag top l->r)
//50,100,100,50 (diag bot l->r)
//100,50,50,100 (diag top r->l)
//100,100,50,50 (diag bot r->l)


const p1 = new Geometry.Point(50,50);
const p2 = new Geometry.Point(100,150);
const line = new Geometry.Line({p1,p2},50,100,100,50);

function debug() {
    //console.log(mouse.get_position());

    
    
    //Draw.grid(canvas.width/50,"rgba(50, 85, 200, 0.15)");
}

// Execution
const main = ()=> {
    create_debug_elements();
    loop();
}
main();

function loop() {
    draw();
    debug();

    requestAnimationFrame(loop);
}

// Functions
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //Draw the sky (background)
    Draw.rect(0,0,canvas.width,canvas.height,sky_color);


    //Draw.line(0,0,canvas.width,canvas.height);

}

function create_debug_elements() {
    if (debug_mode) {
        const debug_header = document.createElement("h3");
        debug_header.style.textAlign="center";
        debug_header.style.fontFamily="Arial";
        const debug_element = document.createElement("p");
        debug_element.style.textAlign = "center";


        debug_header.innerText = "Debuging Messages";
        body.appendChild(debug_header);
        body.appendChild(debug_element);
    }
}
