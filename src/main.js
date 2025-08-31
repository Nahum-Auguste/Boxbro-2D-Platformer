import * as Draw from "./modules/draw.js";
import {canvas} from "./modules/draw.js";
import Player, { Collision } from "./modules/player.js";
import * as Mouse from "./modules/mouse.js";

// Document Variables
const body = document.getElementsByTagName("body")[0];

// Debugging Variables
const SHOW_DEBUG = true;
const DEBUG_ARRAY = [];

//Define Mouse
const mouseData = {
    canGrab:true,
    storage:[]
}
addEventListener("mousemove",handleMouseMove);
addEventListener("mousedown",handleMouseDown);
addEventListener("mouseup",handleMouseUp);

//Define Player
let px = 100;
let py = 100;
const player = new Player(px,py,new Collision.Boundary(new Collision.SquareShape(px,py,50,90)));
player.debugMode=true;

//Define Canvas Parameters
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;


// Set canvas parameters
canvas.style.border = "solid 1px black";
const aspectRatio = (16/9);
const resolution = 1;
const displayWidth = 1000;
const displayHeight = displayWidth/aspectRatio;
canvas.style.width = displayWidth+"px";
canvas.style.height = displayHeight+"px";
canvas.width = displayWidth*resolution;
canvas.height = displayHeight*resolution;

// Execution
const init = ()=> {
        // Draw to Canvas
        requestAnimationFrame(draw)

        // Debug Section
        debugMode(SHOW_DEBUG);
}
init();

// Functions
function draw() {
    if (!(ctx instanceof CanvasRenderingContext2D)) {return;}
    ctx.clearRect(0,0,canvas.width,canvas.height);

    if (SHOW_DEBUG) {
        Draw.grid(16,"rgba(50,200,100,.3)");
    }
    

    //NOTE!!! Even though its not shown, the Draw methods require the ctx variable!
    player.drawCollisionBox();
    //Draw.line(0,0,canvas.width,canvas.height);

    window.requestAnimationFrame(draw);
}

function handleMouseMove(event) {
    if (player.hasCollision) {
        player.isMouseColliding(event);
        console.log("player mouse colliding: " + player.mouseColliding);
    }
    if (player.debugMode) {
        debugColorVertices(event, player.collisionBoundary);
    } 

    for (let i=0; i<mouseData.storage.length; i++) {
        const obj = mouseData.storage[i];
        const m = Mouse.getPosition(canvas,event);
        const dx = 0//m.x-obj.x;
        const dy = 0//m.y-obj.y;

        obj.x=m.x-dx;
        obj.y=m.y-dy;
        player.collisionBoundary.formatEdges();
    }
    
}

function handleMouseDown(event) {
    
    debugMoveVertices(event,player.collisionBoundary);
    console.log("mousedown",mouseData.storage);
}

function handleMouseUp(event) {
    mouseData.storage=[];
    console.log("mouseup",mouseData.storage);
}

function debugMode(show=true) {
    if (show) {
        const debug_header = document.createElement("h3");
        debug_header.style.textAlign="center";
        debug_header.style.fontFamily="Arial";
        const debug_element = document.createElement("p");
        debug_element.style.textAlign="center";
        let debug_text = "";

        DEBUG_ARRAY.map((e)=>{debug_text+=e+"\n"})

        debug_header.innerText = "debug messages";
        debug_element.innerText = debug_text;
        body.appendChild(debug_header);
        body.appendChild(debug_element);

    }
}

/**
 * @param {MouseEvent} event
 * @param {Collision.Boundary} collisionBoundary 
 */
function debugColorVertices(event, collisionBoundary, range=5) {
    const vertices = collisionBoundary.vertices;
    const m = Mouse.getPosition(canvas,event);


    vertices.forEach(v => {
        let dx = m.x-v.x;
        let dy = m.y-v.y;

        if ((dx*dx + dy*dy)<=(range*range)) {
            //console.log("mouse touching v"+v.id);
            v.vertexColor = "rgba(247, 82, 82, 0.85)"
        }
        else {
            v.vertexColor = v.baseVertexColor;
        }


    });
}

function debugMoveVertices(event,collisionBoundary,range=5) {
    const vertices = collisionBoundary.vertices;
    const m = Mouse.getPosition(canvas,event);

    vertices.forEach(v => {
        let dx = m.x-v.x;
        let dy = m.y-v.y;

        if ((dx*dx + dy*dy)<=(range*range)) {
            mouseData.storage.push(v);
        }
    });
}