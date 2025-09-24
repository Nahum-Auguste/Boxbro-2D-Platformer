import canvas from "./canvas.js";
import {ctx} from "./canvas.js";
import Utils from "./utils.js";

//global defaults
const default_point_size = 3;

export default class Draw {

    static area(points,color="black") {
        
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let i=0; i<points.length; i++) {
            const p = points[i];
            ctx.lineTo(p.x,p.y); 
        }
        ctx.closePath();
        ctx.fill();
    }

    static circle(x,y,r=3,color="black",filled=true,lineWidth=1) {
        ctx.fillStyle=color;
        ctx.strokeStyle=color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(x,y,r,0,Math.PI*2);
        ctx.closePath()
        if (filled){
            ctx.fill();
        }
        else {
            ctx.stroke();
        }
    }

    static grid(spacing = 1, color = "rgba(0,0,0,.2)"){
        for (let x=0; x<canvas.width; x+=spacing){
            this.line(x,0,x,canvas.height,1,color);
        }
        for (let y=0; y<canvas.height; y+=spacing) {
            this.line(0,y,canvas.width,y,1,color);
        }
    }

    static line(x1,y1,x2,y2,width=1,color="rgb(0,0,0)") {
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.closePath();
    }

    static line_extra(options={}) {
        if (!("color" in options)) {
            options.color = "black";
        }
        if (!("width" in options)) {
            options.width = 1;
        }
        if (("lineWidth" in options)) {
            options.width = options.lineWidth;
        }

        if ("border" in options) {
            if (!("border_color" in options)) {
                options.border_color = "black";
            }
            
            this.line(options.x1,options.y1,options.x2,options.y2,Utils.clamp(1,options.width+2.5,Infinity),options.border_color);
        }

        this.line(options.x1,options.y1,options.x2,options.y2,options.width,options.color);
    }

    static point(x,y,size=default_point_size,color="black") {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x,y,size,0,Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }

    static point_extra(options={}) {
        const dps = default_point_size;
        if (!("size" in options)) {
            options.size = dps;
        }

        //border
        if ("border" in options) {
            if ((!"border_color" in options)) {
                options.border_color = "black";
            }
            
            this.point(options.x,options.y,Utils.clamp(options.size,options.size+1,Infinity),options.border_color);   
        }

        //main point
        if (!("color" in options)) {
            options.color = "black";
        }
        this.point(options.x,options.y,options.size,options.color);

        //iris
        if (!("iris_color" in options)) {
            options.iris_color = "black";
        }
        if ("iris" in options) {

            this.point(options.x,options.y,Utils.clamp(.25,options.size-1.2,options.size),options.iris_color);
        }
    }

    static rect(x,y,w,h,color="black") {
        ctx.fillStyle = color;
        ctx.fillRect(x,y,w,h);
    }

    static text(options={}) {
        if (!("color" in options)) {
            options.color = "black";
        }
        if (!("size" in options)) {
            options.size = 10;
        }
        if (!("font" in options)) {
            options.font = "Ariel";
        }
        ctx.fillStyle = options.color;
        ctx.font = options.size + "px " + options.font;

        let xoffset = 0;

        if (options.centered) {
            xoffset = ctx.measureText(options.text).width/2; 
        }


        ctx.fillText(options.text,options.x-xoffset,options.y);
    }

}




