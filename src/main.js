import * as Draw from "./modules/draw.js";
import {canvas} from "./modules/draw.js";
import Mouse from "./modules/peripherals/mouse.js";
import Keyboard from "./modules/peripherals/keyboard.js";
import Geometry from "./modules/geometry/geometry.js";
import Entity from "./modules/entity/entity.js";
import Mesh from "./modules/geometry/mesh.js";
import DebugBlock1 from "./modules/world-object-templates/ground/debug_block1.js";
import sceneManager from "./scene-manager.js";
import Scene from "./modules/scenes/scene.js";
import Body from "./modules/entity/body/body.js";
import Line from "./modules/geometry/line.js";
import Point from "./modules/geometry/point.js";

// Document Variables
const body = document.getElementsByTagName("body")[0];

// Debugging Variables
const DEBUG_MODE = true;
const DEBUG_VERTICES = !true;
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
    const scene = sceneManager.current_scene;
    const entities = scene.entity_list;
    draw(entities);
    physics(entities);
    debug(entities);
    window.requestAnimationFrame(cycle);
}

/**
 * 
 * @param {Scene} scene 
 */
function draw(entities) {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    
    entities.forEach(e=>{
        e.draw();
    })

    //player.drawCollisionArea();
}

function physics(entities) {
    entities.forEach(e=>{
        if (e instanceof Body) {
            e.doPhysics();
        }
    })
}

function debug(entities) {
    if (DEBUG_VERTICES && ! DEBUG_MODE) {
        entities.forEach(e=>{
        e.drawings[e.drawings.length-1].mesh.vertices.forEach(v=>{v.handleDebugMode()});
    })
    }
    if (!DEBUG_MODE) {return;}
    const debug = document.getElementById("debug");
    DEBUG_ARRAY = [
    "HOLD CTRL TO SHOW GRIP",
    "Entites: " + Entity.getEntityCount(),
    "Meshes: " + Mesh.getGlobalMeshCount(),
    "Edges: " + Mesh.getGlobalEdgeCount(),
    "Vertices: " + Mesh.getGlobalVertexCount(),
    ]

    //console.log(Keyboard.down);
    
    //const line = new Line(30,130,100,0);
    //Draw.line(30,30,100,150);

    /*
    Draw.line(30,30,230,230)
    //Draw.line(230,30,30,230);
    if (Geometry.isPointAboveLine(Mouse.x,Mouse.y,30,30,230,230)) {
        console.log("above");
        
    }
    if (Geometry.isPointBelowLine(Mouse.x,Mouse.y,30,30,230,230)) {
        console.log("below");
        
    }
    */
    //30,30,230,30 is hori l->r
    //230,30,30,30 is hori r->l
    //30,30,230,230 is diag l->r
    //230,30,30,230 is diag r->l
    //100,30,100,230 is vert t->b
    //100,230,100,30 is vert b->t

    /*
    const line = new Line(30,30,230,30);
    const p = new Point(Mouse.x,Mouse.y);
    const pp =  Geometry.point_umbra_of_line(p,line);
    pp.draw(3,"yellow");
    //console.log(pp);
    
    if (pp) {
        Geometry.normal_of_point_to_line(p,line).draw(pp.x,pp.y);
        //console.log(pp);
        
        //console.log(Geometry.normal_of_point_to_line(p,line));
        
    }
    */

    //const line = new Line(30,30,230,230);
    //const p = new Point(Mouse.x,Mouse.y);
    //const pc =  Geometry.point_cast_of_line(p,line);
    
    
    
    
    
    if (debug!=null) {
        debug.innerText="";
        DEBUG_ARRAY.map((e)=>{
            debug.innerText+=e+"\n"
        })
    }

    //console.log(Mouse.heldData);
    //console.log(Keyboard.down);
    
    
    if (Keyboard.down.includes("Control")) {
        Draw.grid(8,"rgba(181, 70, 255, 0.32)");
    }
    entities.forEach(e=>{
        e.handleDebugMode()
        
        //console.log(e.gravityVector);
        
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
    Mouse.heldData = [];
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