import Draw from "./modules/draw.js";
import canvas, { ctx } from "./modules/canvas.js";
import CollisionArea from "./modules/collision/collision-area.js";
import Geometry from "./modules/geometry/geometry.js";
import RectShape from "./modules/geometry/shapes/rect-shape.js";
import mouse from "./modules/mouse.js";
import Collision from "./modules/collision/collision.js";
import StaticBody from "./modules/bodies/static-body.js";
import Body from "./modules/bodies/body.js";
import KineticBody from "./modules/bodies/kinetic-body.js";
import Player from "./modules/world-entities/player.js";
import keyboard from "./modules/keyboard.js";

// Document Variables
const body = document.getElementsByTagName("body")[0];

// Debugging Variables
const show_debug = true;

//Stage parameters
let sky_color = "rgba(255, 255, 255, 1)";
const rect = new RectShape(370,150)
const player = new Player(250,100, new CollisionArea(200,100,new RectShape(50,50)),3);
new StaticBody(250,200,new CollisionArea(100,400,rect));

// Execution
const main = ()=> {
    create_debug_section();
    loop();
}
main();

function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    draw();
    physics();
    debug();
    requestAnimationFrame(loop);
}

// Functions
function draw() {
    
    ctx.fillStyle = sky_color;
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function physics() {
    Body.get_entity_list().forEach(b=>{
        b.physics();
    });
}

function debug() {
    if (!show_debug) {return;}
    //Draw.grid(16,"rgba(50,200,100,1)");

    //console.log(Collision.is_point_to_right_of_line(mouse.x,mouse.y,100,30,30,130));
    //console.log(new StaticBody().get_id());

    Body.get_entity_list().forEach(b=>{
        b.handle_debug_mode();
    });

    CollisionArea.get_entity_list().forEach(a=>{
        //a.handle_debug_mode();
        //console.log(a.is_point_colliding(mouse.x,mouse.y));
    })

    const debugmat = [
        [
            "Mouse Data:",
            mouse.x?`(${mouse.x.toFixed(2)},${mouse.y.toFixed(2)})`:"(undefined,undefined)",
            "Up: " + mouse.up + ", Down: " + mouse.down,
            mouse.hovered? "hovered: " + mouse.hovered.get_id() : "hovered: null",
            "held: " + mouse.held.length,
            "held data: " + mouse.held_data_arr.length,
        ],
        [
            "Body Data:",
            "Bodies: " + Body.get_entity_list().length,
            "Static Bodies: " + StaticBody.get_entity_list().length,
            "Kinetic Bodies: " + KineticBody.get_entity_list().length,
            "Collision Areas: " + CollisionArea.get_entity_list().length,
        ],
        [
            "Keyboard Data:",
            "Down: " + keyboard.down,
        ],
        [
            "Player Data:",
            "spd: " + player.spd,
            "gravity: " + `(${player.gravity.x},${player.gravity.y.toFixed(2)})`,
            "airtime: " + player.airtime,
            "grounded: " + player.check_grounded(),
            "jump time: " + `${player.jump_time}/${player.jump_timer}`,
            "jump vec: " + `(${player.jump_vector.x},${player.jump_vector.y.toFixed(2)})`,
        ]
    ];

    for (let i=0; i<5; i++) {
        const p = document.getElementById("d"+i);
        
        if (p && i<debugmat.length) {
            const arr = debugmat[i];
            p.innerText = "";
            arr.forEach(e=>{
                p.innerText += e + "\n";
            });
        }
        else if (p) {
            p.style.width = 0;
        }
    }

    
}

function create_debug_section() {
    const header = document.createElement("h2");
    header.style.backgroundColor = "lightgrey";
    header.innerText = "Debug";
    header.style.fontFamily = "Comic Sans MS";
    body.appendChild(header);

    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.justifyContent = "start";
    body.appendChild(container);

    for (let i = 0; i < 5; i++) {
        const p = document.createElement("p");
        container.appendChild(p)
        p.id = "d" + i;
        p.style.width = 170 + "px";
    }


    container.childNodes.forEach(c=>{
        if (c instanceof HTMLParagraphElement) {
            c.style.backgroundColor = "lightgrey";
            c.style.textAlign="center";
            c.style.fontFamily = "Comic Sans MS";
            c.style.marginLeft = "10px";
        }
    });
}
