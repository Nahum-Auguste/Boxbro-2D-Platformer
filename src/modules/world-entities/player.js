import KineticBody from "../bodies/kinetic-body.js";
import keyboard from "../keyboard.js";

export default class Player extends KineticBody {
    base_spd;
    spd = this.base_spd;

    constructor(x,y,collision_area,spd=0) {
        super(x,y,collision_area);
        this.base_spd = spd;
        this.spd = this.base_spd;
    }

    physics() {
        super.physics();
        this.handle_keyboard();
    }

    handle_keyboard() {
        this.handle_keyboard_movement();
    }

    handle_keyboard_movement() {
        const up = keyboard.is_down("w");
        const down = keyboard.is_down("s");
        const left = keyboard.is_down("a");
        const right = keyboard.is_down("d");

        let dx = (right - left) * this.spd;
        let dy = (down - up) * this.spd;

        if (dx && dy) {
            const mag = Math.sqrt(dx*dx + dy*dy);
            dx /= Math.abs(mag/dx);
            dy /= Math.abs(mag/dy);
        }
        
        this.move(dx,dy);
    }
}