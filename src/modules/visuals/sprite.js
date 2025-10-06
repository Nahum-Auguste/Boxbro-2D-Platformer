import { ctx } from "../canvas.js";
import Draw from "../draw.js";
import Utils from "../utils.js";


export default class Sprite {
    /**@type {HTMLImageElement} */
    image;

    static sprites_folder = "../../../images/sprites";

    border = false;
    angle = 0;
    angle_speed = 0;
    scale = 1;
    opacity = 1;

    constructor(src,w,h,origin_type="top_left") {
        this.image = new Image(w,h);
        this.image.src = src;
        this.origin_type = origin_type;
    }

    draw(x,y,border=false) {
        if (!this.image) {return;}
        this.angle+=this.angle_speed;
        //console.log(this.angle);
        
        const w = this.image.width;
        const h = this.image.height;

        if (border || this.border) {
            Draw.rect(x,y,w,h);
        }
        let sx = x;
        let sy = y;

        switch (this.origin_type) {
            case "top_left":
                break;
            case "center":
                sx-=w/2;
                sy-=h/2;
                break;
            
                default:
                    break;
        }   
        ctx.save();
        ctx.translate(x,y);
        ctx.scale(this.scale,this.scale);
        ctx.globalAlpha = this.opacity;
        ctx.rotate(Utils.to_radians(this.angle));
        ctx.drawImage(this.image,sx-x,sy-y,w,h);
        ctx.restore();

        
    }

}