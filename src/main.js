import * as Draw from "./modules/draw.js";
import {player} from "./modules/player.js";
import {canvas} from "./modules/draw.js";
import Mouse from "./modules/mouse.js";
import Keyboard from "./modules/keyboard.js";
import Geometry from "./modules/geometry/geometry.js";

// Document Variables
const body = document.getElementsByTagName("body")[0];

// Debugging Variables
const DEBUG_MODE = true;
const DEBUG_ARRAY = [];

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
    debugMode(DEBUG_MODE);
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

    player.drawCollisionArea();
}

function physics() {
    player.doPhysics();
}

function debug() {
    //console.log("down:",Keyboard.down,"up:",Keyboard.up);
    //console.log(isPointWithinRegion(Mouse.x,Mouse.y,0,50,50,0));
    //console.log(Mouse.held);
    //Draw.line(0,0,50,50);
    //console.log(Geometry.isPointBelowLine(Mouse.x,Mouse.y,0,0,50,50,10));
    //Draw.line(0,50,50,0);
    //console.log(Geometry.isPointAboveLine(Mouse.x,Mouse.y,0,50,50,0,20));
    
    Draw.grid(16,"rgba(50,200,100,.3)");
    if (player.debugEnabled) {
        player.handleDebugMode();
    }
}

function debugMode(show=true) {
    if (show) {
        const debug_header = document.createElement("h3");
        debug_header.style.textAlign="center";
        debug_header.style.fontFamily="Arial";
        const debug_element = document.createElement("p");
        let debug_text = "";

        DEBUG_ARRAY.map((e)=>{debug_text+=e+"\n"})

        debug_header.innerText = "debug messages";
        debug_element.innerText = debug_text;
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