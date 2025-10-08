import Draw from "./modules/draw.js";
import canvas, { ctx } from "./modules/canvas.js";
import CollisionArea from "./modules/collision/collision-area.js";
import Geometry from "./modules/geometry/geometry.js";
import RectShape from "./modules/geometry/shapes/rect-shape.js";
import mouse from "./modules/mouse.js";
import Collision from "./modules/collision/collision.js";

// Document Variables
const body = document.getElementsByTagName("body")[0];

// Debugging Variables
const show_debug = true;

//Stage parameters
let sky_color = "rgba(255, 255, 255, 1)";
new CollisionArea(300,200,new RectShape(70,50));

// Execution
const main = ()=> {
    create_debug_section();
    loop();
}
main();

function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    draw();
    debug();
    requestAnimationFrame(loop);
}

// Functions
function draw() {
    
    ctx.fillStyle = sky_color;
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function debug() {
    if (!show_debug) {return;}
    //Draw.grid(16,"rgba(50,200,100,1)");

    //console.log(Collision.is_point_to_right_of_line(mouse.x,mouse.y,100,30,30,130));

    CollisionArea.get_entity_list().forEach(a=>{
        a.handle_debug_mode();
        //console.log(a.is_point_colliding(mouse.x,mouse.y));
    })

    const debugarr = [
        "Mouse Data",
        mouse.x?`(${mouse.x.toFixed(2)},${mouse.y.toFixed(2)})`:"(undefined,undefined)",
        "Up: " + mouse.up + ", Down: " + mouse.down,
        mouse.hovered? "hovered: " + mouse.hovered.get_id() : "hovered: null",
        mouse.held? "held: " + mouse.held.get_id() : "held: null",
        
    ];

    const d1 = document.getElementById("d1");
    if (d1) {
        d1.innerText = "";
        debugarr.forEach(e=>{
            d1.innerText += e + "\n";
        })
    }

    
}

function create_debug_section() {
    const header = document.createElement("h2");
    header.style.backgroundColor = "lightgrey";
    header.innerText = "Debug";
    header.style.fontFamily = "Comic Sans MS";

    body.appendChild(header);

    const d1 = document.createElement("p");
    d1.style.backgroundColor = "lightgrey";
    d1.id = "d1";
    d1.style.textAlign="center";
    d1.style.fontFamily = "Comic Sans MS";

    body.appendChild(d1);
}
