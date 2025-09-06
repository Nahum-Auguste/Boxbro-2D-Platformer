//import { canvas } from "../draw.js";
import * as Draw from "../draw.js";
import Keyboard from "./keyboard.js";





const Mouse = {
    x:undefined,
    y:undefined,
    heldData:[],
    held:[],
    down:false,
    up:true,
    HeldDataObject: class {
        dx;
        dy;
        constructor(obj) {
            this.dx = Mouse.x-obj.x;
            this.dy = Mouse.y-obj.y;
        }
    },
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
        if (this.heldData.length<this.held.length) {
            this.heldData.push(new this.HeldDataObject(obj));
        }
        else {
            const data = this.heldData[idx];
            
            obj.x = this.x - data.dx;
            obj.y = this.y - data.dy;

            if (Keyboard.down.includes("Control")) {
                obj.x-=(obj.x%snapSpacing);
                obj.y-=(obj.y%snapSpacing);
            }
        }
    }

}

export default Mouse;