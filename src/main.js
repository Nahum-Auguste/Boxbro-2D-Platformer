import Draw from "./modules/draw.js";
import canvas from "./modules/canvas.js";
import {ctx} from "./modules/canvas.js";
import mouse from "./modules/peripherals/mouse.js";
import keyboard from "./modules/peripherals/keyboard.js";
import Geometry from "./modules/geometry/geometry.js";
import Collision from "./modules/collision/collision.js";
import KineticBody from "./modules/entities/bodies/kineticBody.js";
import StaticBody from "./modules/entities/bodies/staticBody.js";


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
//50,50,50,100 (v t->b)
//50,100,50,50 (v b->t)

const p1 = new Geometry.Point(50,50);
const p2 = new Geometry.Point(100,150);
const line = new Geometry.Line({},100,50,50,100);
const line2 = new Geometry.Line({},100,100,50,50);

//const square = Collision.generate_collision_area(Geometry.generate_rect_mesh(x,y,w,h));
//square.print();

const px = 300;
const py = 300;
const playa = new KineticBody(px,py,Collision.generate_collision_area(Geometry.generate_rect_mesh(px,py,50,50,"center")));


const sx = 175;
const sy = 190;
const sw = 70;
const sh = 70;
const stat = new StaticBody(sx,sy,Collision.generate_collision_area(Geometry.generate_rect_mesh(sx,sy,sw,sh)))

function debug() {
    //console.log(mouse.get_position());
    //square.print();
    playa.handle_debug_mode();
    //square.handle_debug_mode();
    playa.handle_collision();
    stat.handle_debug_mode();
    //console.log(line.intersects(line2,true));
    
    

    //console.log(mouse.held_obj_data);

    //line.draw();
    //console.log(Collision.is_point_to_left_of_line(mouse.x,mouse.y,{line,range:40}));
    
    
    
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
