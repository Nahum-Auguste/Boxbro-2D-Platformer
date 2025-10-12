import canvas from "./canvas.js";
import { ctx } from "./canvas.js";
import Geometry from "./geometry/geometry.js";

export default class Draw {
    static grid(spacing = 1, color = "rgba(0,0,0,.2)"){
        if (!(canvas instanceof HTMLCanvasElement)) {return;}

        for (let x=0; x<canvas.width; x+=spacing){
            Draw.line(x,0,x,canvas.height,color);
        }
        for (let y=0; y<canvas.height; y+=spacing) {
            Draw.line(0,y,canvas.width,y,color);
        }
    }

    static line(x1,y1,x2,y2,color="rgb(0,0,0)",line_width=1) {
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = line_width;
        ctx.stroke();
        ctx.closePath();
    }

    static text(text,x,y,size=15,color="black") {
        ctx.fillStyle = color;
        ctx.font = size + "px Comic Sans MS";
        ctx.textAlign="center";
        ctx.fillText(text,x,y);
    }

    static point(x,y,size=2,color="black",filled=true,line_width=1) {
        ctx.beginPath();
        ctx.fillStyle=color;
        ctx.strokeStyle=color;
        ctx.lineWidth = line_width;
        ctx.arc(x,y,size,0,Math.PI*2);
        
        if (filled) {
            ctx.fill();
        }
        else {
            ctx.stroke();
        }
    }

    static area(points=[],color="black",offx=0,offy=0) {
        if (Array.isArray(points[0])) {
            points = Geometry.generate_points(points);
        }

        ctx.beginPath();
        points.forEach((p,i)=>{
            if (i==0) {
                ctx.moveTo(p.x+offx,p.y+offy);
            }
            else {
                ctx.lineTo(p.x+offx,p.y+offy);
            }
        })
        ctx.closePath();
        ctx.fillStyle=color;
        ctx.fill();
    }

}

