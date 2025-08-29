export const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d"); 


export function grid(spacing = 1, color = "rgba(0,0,0,.2)"){
    if (!(canvas instanceof HTMLCanvasElement)) {return;}

    for (let x=0; x<canvas.width; x+=spacing){
        line(x,0,x,canvas.height,color);
    }
    for (let y=0; y<canvas.height; y+=spacing) {
        line(0,y,canvas.width,y,color);
    }
}

export function line(x1,y1,x2,y2,color="rgb(0,0,0)") {
    if (!(ctx instanceof CanvasRenderingContext2D)) {
        return;
    }

    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
}