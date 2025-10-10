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
import player from "./modules/world-entities/player.js";
import keyboard from "./modules/keyboard.js";
import camera from "./modules/camera.js";

// Document Variables
const body = document.getElementsByTagName("body")[0];

// Debugging Variables
const show_debug = true;

//Stage parameters
let sky_color = "rgba(255, 255, 255, 1)";
const rect = new RectShape(370,150)
new StaticBody(250,200,new CollisionArea(100,400,rect));
new StaticBody(250,200,new CollisionArea(600,350,rect));


// Execution
const main = ()=> {
    create_debug_section();
    loop();
    //camera.move(0,0);
}
main();

function loop() {
    const view = camera.get_view();
    ctx.clearRect(view.x,view.y,view.width,view.height);
    draw();
    physics();
    debug();
    camera.handle_camera();
    mouse.handle_mouse();

    requestAnimationFrame(loop);
}

// Functions
function draw() {
    const view = camera.get_view();
    ctx.fillStyle = sky_color;
    ctx.fillRect(view.x,view.y,view.width,view.height);
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
    
    const view = camera.get_view();
    const zoom_out = keyboard.is_pressed("o");
    const zoom_in = keyboard.is_pressed("p");
    const zoom_const = .10;
    
    if (zoom_out) {
        camera.inc_zoom(-zoom_const);
    }
    if (zoom_in) {
        camera.inc_zoom(zoom_const);
    }
    //camera.move(3,-1);
    //console.log(camera.zoom);
    //console.log(ctx.getTransform());
    

    const debugmat = [
        [
            "Mouse Data:",
            mouse.x?`(${mouse.x.toFixed(2)},${mouse.y.toFixed(2)})`:"(undefined,undefined)",
            mouse.last_x?`(${mouse.last_x.toFixed(2)},${mouse.last_y.toFixed(2)})`:"(undefined,undefined)",
            "Up: " + mouse.up + ", Down: " + mouse.down,
            mouse.hovered? "hovered: " + mouse.hovered.get_id() : "hovered: null",
            "held: " + mouse.held.length,
            "held data: " + mouse.held_data_arr.length,
            "moving: " + mouse.moving,
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
            //"Up: " + keyboard.up,
            "Pressed: " + keyboard.pressed,
        ],
        [
            "Player Data:",
            `(${player.x.toFixed(2)},${player.y.toFixed(2)})`,
            "spd: " + player.spd,
            "\nvelocity:\n" + `(${player.velocity.x.toFixed(2)},${player.velocity.y.toFixed(2)})`,
            "\ngravity:\n" + `(${player.gravity.x},${player.gravity.y.toFixed(2)})`,
            "airtime: " + player.airtime,
            "\njump initial velocity:\n" + `(${player.jump_initial_velocity.x.toFixed(2)},${player.jump_initial_velocity.y.toFixed(2)})`,
            "\njump velocity:\n" + `(${player.jump_velocity.x.toFixed(2)},${player.jump_velocity.y.toFixed(2)})`,
            //"jump time: " + `${player.jump_time}/${player.jump_timer}`,
            "grounded: " + player.grounded,
            "jump held: " + player.jump_held,
        ],
        [
            "Camera Data:",
            `(${camera.x.toFixed(0)},${camera.y.toFixed(0)},${camera.x2.toFixed(0)},${camera.y2.toFixed(0)})`,
            camera.width.toFixed(0) + " x " + camera.height.toFixed(0),
            "zoom: " + camera.zoom.toFixed(2),
            `(${view.x.toFixed(0)},${view.y.toFixed(0)},${view.x2.toFixed(0)},${view.y2.toFixed(0)})`,
            view.width.toFixed(0) + " x " + view.height.toFixed(0),
        ],
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
        p.style.width = 200 + "px";
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
