import * as Draw from "./modules/draw.js";
import {player} from "./modules/scenes/debug-scene/debug-scene.js";
import {canvas} from "./modules/draw.js";
import Mouse from "./modules/peripherals/mouse.js";
import Keyboard from "./modules/peripherals/keyboard.js";
import Geometry from "./modules/geometry/geometry.js";
import Entity from "./modules/entity/entity.js";
import Mesh from "./modules/geometry/mesh.js";
import DebugBlock1 from "./modules/world-object-templates/ground/debug_block1.js";

// Document Variables
const body = document.getElementsByTagName("body")[0];

// Debugging Variables
const DEBUG_MODE = true;
let DEBUG_ARRAY = [];
//const snapSpacing = 8;

//Preparation
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
canvas.style.border = "solid 1px black";
const aspectRatio = (16/9);
const resolution = 1;
const displayWidth = 1000;
const displayHeight = displayWidth/aspectRatio;
canvas.style.width = displayWidth+"px";
canvas.style.height = displayHeight+"px";
canvas.width = displayWidth*resolution;
canvas.height = displayHeight*resolution;

//Mouse Stuff
addEventListener("mousemove",handleMouseMove);
addEventListener("mousedown",handleMouseDown);
addEventListener("mouseup",handleMouseUp);

//Keyboard Stuff
addEventListener("keydown",handleKeyDown);
addEventListener("keyup",handleKeyUp);


//entities
const entities = [
    player,
    new DebugBlock1(20,100)
];



// Execution
const main = ()=> {
    //player.printCollisionValues();
    window.requestAnimationFrame(cycle);

    // Debug Section
    createDebugSection(DEBUG_MODE);
}
main();

// Functions
function cycle() {
    
    draw();
    physics();
    debug();
    window.requestAnimationFrame(cycle);
}

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    entities.forEach(e=>{
        e.draw();
    })

    //player.drawCollisionArea();
}

function physics() {
    player.doPhysics();
}

function debug() {
    if (!DEBUG_MODE) {return;}
    const debug = document.getElementById("debug");
    DEBUG_ARRAY = [
    "HOLD CTRL TO SHOW GRIP",
    "Entites: " + Entity.getEntityCount(),
    "Meshes: " + Mesh.getGlobalMeshCount(),
    "Edges: " + Mesh.getGlobalEdgeCount(),
    "Vertices: " + Mesh.getGlobalVertexCount(),
    ]
    
    if (debug!=null) {
        debug.innerText="";
        DEBUG_ARRAY.map((e)=>{
            debug.innerText+=e+"\n"
        })
    }

    //console.log(Mouse.held);
    console.log(Keyboard.down);
    
    
    if (Keyboard.down.includes("Control")) {
        Draw.grid(8,"rgba(181, 70, 255, 0.32)");
    }
    entities.forEach(e=>{
        e.handleDebugMode()
    })
    
}

function createDebugSection(show=true) {
    if (show) {
        const debug_header = document.createElement("h3");
        debug_header.style.textAlign="center";
        debug_header.style.fontFamily="Arial";
        const debug_element = document.createElement("p");
        debug_element.id="debug";
        debug_element.style.textAlign="center";

        debug_header.innerText = "debug messages";
        body.appendChild(debug_header);
        body.appendChild(debug_element);
    }
}

function handleMouseMove(event) {
    //console.log(Mouse.data);
    Mouse.setPosition(event);

}

function handleMouseDown(event) {
    Mouse.down = true;
    Mouse.up = false;

    //console.log(Mouse);
}

function handleMouseUp(event) {
    Mouse.down = false;
    Mouse.up = true;

    //release the goods
    Mouse.held = [];
    Mouse.objectDistances = [];
    Mouse.dx=undefined;
    Mouse.dy=undefined;

    //console.log(Mouse);
}

/**
 * 
 * @param {KeyboardEvent} event 
 */
function handleKeyDown(event) {
    
    const key = event.key;
    //console.log("down:",key);
    Keyboard.setKeyDown(key);
    //console.log(Keyboard);

    
}

/**
 * 
 * @param {KeyboardEvent} event 
 */
function handleKeyUp(event) {
    const key = event.key;
    //console.log("up:",key);
    Keyboard.setKeyUp(key);
    //console.log(Keyboard);
}