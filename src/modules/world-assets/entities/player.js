import KineticBody from "../../entities/bodies/kineticBody.js";
import { CollisionArea } from "../../collision/collision.js";
import Geometry from "../../geometry/geometry.js";
import keyboard from "../../peripherals/keyboard.js";


class Controls {
    moveleft_key;
    moveright_key;
    jump_key;
    sprint_key;
}

const default_controls = new Controls();
default_controls.jump_key = " ";
default_controls.moveleft_key = "a";
default_controls.moveright_key = "d";
default_controls.sprint_key = "shift"

export default class Player extends KineticBody{
    gravity_y = 18;
    sprinting=false;
    base_spd = 3.5;
    spd = this.base_spd;
    sprint_mult = 1.5;

    constructor(x,y,controls=default_controls) {
        const w = 50;
        const h = 50;
        const collision_mesh = Geometry.generate_rect_mesh(x,y,w,h);
        const collision_area = new CollisionArea(collision_mesh);
        super(x,y,collision_area);

        
        this.controls = controls;
    }

    physics() {
        super.physics();
        this.handle_movement();

    }

    handle_movement() {
        let resulting_spd = this.base_spd;

        //moveleft
        if (keyboard.down_has(this.controls.moveleft_key)) {
            this.move({},-this.spd);
        }
        //moveright
        if (keyboard.down_has(this.controls.moveright_key)) {
            this.move({},this.spd);
        }

        //jump
        if (keyboard.down_has(this.controls.jump_key)) {
            this.handle_jump();
        }

        //sprint
        if (keyboard.down_has(this.controls.sprint_key)) {
            this.sprinting = true;
        }
        else {
            this.sprinting = false;
        }

        //edit spd
        resulting_spd = this.sprinting? resulting_spd*this.sprint_mult : resulting_spd;
        this.spd = resulting_spd;

    }
}

