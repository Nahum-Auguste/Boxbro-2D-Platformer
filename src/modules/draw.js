import Point from "./geometry/point.js";
import Vector from "./geometry/vector.js";

export const canvas = document.getElementById("canvas");

/**
 * @type {CanvasRenderingContext2D} ctx
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

export function grid_radial_at(x,y,spacing = 1, size=8, color = "rgba(0,0,0,.2)"){
    if (!(canvas instanceof HTMLCanvasElement)) {return;}

    let offset = spacing*size;
    let start_x = x-offset;
    let start_y = y-offset;
    let end_x = x+offset;
    let end_y = y+offset;

    for (let i=0; i<=Math.abs(size*2); i++){
        let gx = start_x + (spacing * i);
        let gy = start_y + (spacing * i);
        line(gx,start_y,gx,end_y,color);
        line(start_x,gy,end_x,gy,color);
    }
}

export function line(x1,y1,x2,y2,color="rgb(0,0,0)",width=1,opacity=ctx.globalAlpha) {
    if (!(ctx instanceof CanvasRenderingContext2D)) {
        return;
    }

    const globalOpacity = ctx.globalAlpha;
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.globalAlpha = globalOpacity;

}

export function geometric_line(x,y,line,color="rgb(0,0,0)",width=1,opactiy=ctx.globalAlpha) {
    let x1 = line.x1;
    let y1 = line.y1;
    let x2 = line.x2;
    let y2 = line.y2;

    if (!(ctx instanceof CanvasRenderingContext2D)) {
        return;
    }

    const globalOpacity = ctx.globalAlpha;
    ctx.globalAlpha = opactiy;
    ctx.beginPath();
    ctx.moveTo(x+x1,y+y1);
    ctx.lineTo(x+x2,y+y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.globalAlpha = globalOpacity;

}

/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {Vector} vector 
 */
export function vector(x,y,vector,color="rgb(0,0,0)",width=1,opacity=ctx.globalAlpha) {
    line(x,y,x+vector.x,y+vector.y,color,width,opacity);
}

export function area(points,color="rgba(181, 105, 211, 0.24)",opactiy=ctx.globalAlpha) {
    const globalOpacity = ctx.globalAlpha;
    ctx.globalAlpha = opactiy;
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.moveTo(points[0][0],points[0][1]);
    for (let i=1; i<points.length; i++) {
        let p = points[i];
        ctx.lineTo(p[0],p[1]);
    }
    ctx.fill();
    ctx.globalAlpha = globalOpacity;
}

export function circle(x,y,size=3,color="black",filled=true,opactiy=ctx.globalAlpha) {
    const globalOpacity = ctx.globalAlpha;
    ctx.globalAlpha = opactiy;
    if (filled) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x,y,size,0,2*Math.PI);
        ctx.fill();
    }
    else {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x,y,size,0,2*Math.PI);
        ctx.stroke();
    }
    ctx.globalAlpha = globalOpacity;
    
}

/**
 * 
 * @param {Point} point 
 * @param {*} size 
 * @param {*} color 
 */
export function point(point,size=4,color="black",filled=true,opacity=ctx.globalAlpha) {
    circle(point.x,point.y,size,color,filled,opacity);
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

export function image(image,dx=0,dy=0) {
    ctx.drawImage(image,dx,dy);
}