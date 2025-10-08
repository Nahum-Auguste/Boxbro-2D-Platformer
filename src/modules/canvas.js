/**@type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");

/**@type {CanvasRenderingContext2D} */
export const ctx = canvas.getContext("2d"); 
// Set canvas parameters
    const aspectRatio = (16/9);
    const resolution = 1;
    const displayWidth = 1000;
    const displayHeight = displayWidth/aspectRatio;
    
    canvas.width = displayWidth*resolution;
    canvas.height = displayHeight*resolution;

    canvas.style.width = displayWidth+"px";
    canvas.style.height = displayHeight+"px";
    canvas.style.border = "ridge 10px black";

    ctx.imageSmoothingEnabled = false;

export default canvas;