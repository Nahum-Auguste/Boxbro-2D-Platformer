//import { canvas } from "../draw.js";
import * as Draw from "../draw.js";
import Keyboard from "./keyboard.js";





export default {
    x:undefined,
    y:undefined,
    objectDistances:[],
    held:[],
    down:false,
    up:true,
    /**
     * 
     * @param {MouseEvent} event 
     * @returns 
     */
    setPosition: function (event) {
        const rect = canvas.getBoundingClientRect();
        this.x = event.clientX - rect.left;
        this.y = event.clientY - rect.top;
    },
    /**
     * 
     * @param {MouseEvent} event 
     * @returns 
     */
    getPosition: function () {
        return {
            x:this.x,
            y:this.y
        }
    },
    moveObject: function (obj) {
        const snapSpacing = 8;
        if (!this.held.includes(obj)) {this.held.push(obj);}
        let idx = this.held.indexOf(obj);
        if (this.objectDistances.length<this.held.length) {
            this.objectDistances.push({
                dx:this.x-obj.x,
                dy:this.y-obj.y
            });
        }
        else {
            obj.x = this.x - this.objectDistances[idx].dx;
            obj.y = this.y - this.objectDistances[idx].dy;

            if (Keyboard.down.includes("Control")) {
                obj.x-=(obj.x%snapSpacing);
                obj.y-=(obj.y%snapSpacing);
            }
        }
    }

}