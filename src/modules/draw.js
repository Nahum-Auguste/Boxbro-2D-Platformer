export const canvas = document.getElementById("canvas");

/**
 * @type{CanvasRenderingContext2D} ctx
 */
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

export function text(x,y,text,size=10,color="black",centered=true) {
    if (!(ctx instanceof CanvasRenderingContext2D)) {
        return;
    }
    let tx=x;
    let ty=y;
    if (centered) {
        tx-=(text.length*size*(.6))/2
    }
    const font = "Arial";
    ctx.font = size + "px " + font;
    ctx.fillStyle = color;
    ctx.fillText(text, tx, ty);
}

/**
 * 
 * @param {Array} points 
 * @param {String} color 
 */
export function area(points,color="rgba(181, 105, 211, 0.24)") {
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.moveTo(points[0][0],points[0][1]);
    for (let i=1; i<points.length; i++) {
        let p = points[i];
        ctx.lineTo(p[0],p[1]);
    }
    ctx.fill();
}

export function dot(x,y,size=3,color="black") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,size,0,2*Math.PI);
    ctx.fill();
}

export function circumference(x,y,size=3,thickness=1,color="black") {
    ctx.strokeStyle = color;
    ctx.lineWidth=thickness;
    ctx.beginPath();
    ctx.arc(x,y,size,0,2*Math.PI);
    ctx.stroke();
    ctx.closePath();
}