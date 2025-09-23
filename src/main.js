import Draw from "./modules/draw.js";
import canvas from "./modules/canvas.js";
import {ctx} from "./modules/canvas.js";
import mouse from "./modules/peripherals/mouse.js";
import keyboard from "./modules/peripherals/keyboard.js";
import Geometry from "./modules/geometry/geometry.js";
import Collision from "./modules/collision/collision.js";
import KineticBody from "./modules/entities/bodies/kineticBody.js";
import StaticBody from "./modules/entities/bodies/staticBody.js";
import Vector from "./modules/geometry/vector.js";
import Player from "./modules/world-assets/entities/player.js";
import Body from "./modules/entities/bodies/body.js";
import DebugBlock1 from "./modules/world-assets/objects/debug-block1.js";
import DebugBlock2 from "./modules/world-assets/objects/debug-block2.js";


// Document Variables
const body = document.getElementsByTagName("body")[0];
const sky_color = "rgba(255, 255, 255, 1)";


// Debugging Variables
const debug_mode = true;

// World objects
const sx = 70;
const sy = 170;
const player = new Player(sx,sy);
new DebugBlock1(30,300);
new DebugBlock1(200,250);
new DebugBlock2(470,300);

// Execution
const main = ()=> {
    create_debug_elements();
    loop();
}
main();

function loop() {
    
    physics();
    draw();
    debug();

    requestAnimationFrame(loop);
}

// Functions
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    //Draw the sky (background)
    Draw.rect(0,0,canvas.width,canvas.height,sky_color);

}

function physics() {
    Body.get_body_list().forEach(b=>{
        const options = {vertex_names:false,edge_names:false};
        b.physics();
    })
}

function debug() {
    //50,50,100,50 (h l->r)
    //100,50,50,50 (h r->l)
    //50,50,100,100 (diag top l->r)
    //50,100,100,50 (diag bot l->r)
    //100,50,50,100 (diag top r->l)
    //100,100,50,50 (diag bot r->l)
    //50,50,50,100 (v t->b)
    //50,100,50,50 (v b->t)

    //console.log(keyboard.down);
    

    Body.get_body_list().forEach(b=>{
        const options = {vertex_names:false,edge_names:false};
        b.handle_debug_mode(options);
    })

    const debug_array = [
        "grounded: " + player.grounded,
        "airtime: " + player.airtime,
        "jumptime: " + player.jumptime,
        "spd: " + player.spd,
        "sprinting: " + player.sprinting,
    ];

    let debug_text = "";
    debug_array.forEach(e=>{
        debug_text+=e+"\n";
    })
    const debug_element = document.getElementById("debug");
    if (debug_element) {
        debug_element.innerText = debug_text;
    }

    if (player.collision_area.mesh.get_highest_vertex().y>canvas.height) {
        player.move_to(sx,sy);
    }

    
   //Draw.grid(canvas.width/50,"rgba(50, 85, 200, 0.25)");
}

function create_debug_elements() {
    if (debug_mode) {
        const debug_header = document.createElement("h3");
        debug_header.style.textAlign="center";
        debug_header.style.fontFamily="Arial";
        const debug_element = document.createElement("p");
        debug_element.style.textAlign = "center";
        debug_element.id = "debug";
        debug_element.style.backgroundColor="white";


        debug_header.innerText = "Debuging Messages";
        body.appendChild(debug_header);
        body.appendChild(debug_element);
    }
}
