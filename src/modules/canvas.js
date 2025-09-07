/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
export default canvas;

/** * @type {CanvasRenderingContext2D} ctx */
export const ctx = canvas.getContext("2d"); 


// Set canvas parameters
const aspectRatio = (16/9);
const resolution = 1;
const displayWidth = 1000;
const displayHeight = displayWidth/aspectRatio;
canvas.style.width = displayWidth+"px";
canvas.style.height = displayHeight+"px";
canvas.width = displayWidth*resolution;
canvas.height = displayHeight*resolution;
canvas.style.border = "solid 1px black";
ctx.imageSmoothingEnabled = false;

