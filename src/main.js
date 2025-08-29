import * as Draw from "./modules/draw.js";
import {canvas} from "./modules/draw.js";

// Document Variables
const body = document.getElementsByTagName("body")[0];

// Debugging Variables
const SHOW_DEBUG = true;
const DEBUG_ARRAY = [];

// Execution
const main = ()=> {
    if (canvas instanceof HTMLCanvasElement) {
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

        // Draw to Canvas
        draw(ctx);

        // Debug Section
        debugMode(SHOW_DEBUG);
    }
}
main();

// Functions
function draw(ctx) {
    if (!(ctx instanceof CanvasRenderingContext2D)) {return;}

    //NOTE!!! Even though its not shown, the Draw methods require the ctx variable!
    
    //Draw.line(0,0,canvas.width,canvas.height);
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

        Draw.grid(16,"rgba(50,200,100,.3)")
    }
}