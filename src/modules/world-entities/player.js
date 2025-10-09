import KineticBody from "../bodies/kinetic-body.js";
import Vector from "../geometry/vector.js";
import keyboard from "../keyboard.js";
import Utils from "../utils.js";

export default class Player extends KineticBody {
    base_spd;
    spd = this.base_spd;

    jump_timer = 10;
    jump_time = 0;
    jump = false;
    max_jump = new Vector(0,-15);
    jump_vector = new Vector(0,0);
    jumptime_constant = .15;

    constructor(x,y,collision_area,spd=0) {
        super(x,y,collision_area);
        this.base_spd = spd;
        this.spd = this.base_spd;
    }

    physics() {
        super.physics();
        this.handle_keyboard();
        this.handle_jump();
    }

    handle_keyboard() {
        this.handle_keyboard_movement();
    }

    handle_keyboard_movement() {
        //const up = keyboard.is_down("w");
        //const down = keyboard.is_down("s");
        const left = keyboard.is_down("a");
        const right = keyboard.is_down("d");
        const jump = keyboard.is_down(" ");

        if (this.check_grounded() && jump) {
            this.jump = true;
        }

        const sprint = keyboard.is_down("shift") && this.check_grounded();
        const sprint_mult = 1.5;

        this.spd = this.base_spd;
        this.spd = sprint? this.base_spd*sprint_mult : this.spd;

        let dx = (right - left) * this.spd;
        let dy = 0;// = (down - up) * this.spd;

        const vec = new Vector(dx,dy).normalized();

        this.move(vec.x,vec.y);
    }

    handle_jump() {
        if (this.jump) {
            this.jump_time++;
            this.gravity.clear();
            //this.airtime = 0;
            
            this.jump_vector.y = Utils.clamp(this.max_jump.y,this.max_jump.y-Math.pow(this.jump_time*this.jumptime_constant,2)*(this.max_jump.y/Math.abs(this.max_jump.y)),0);
            this.move(this.jump_vector.x,this.jump_vector.y);
        }

        if (this.jump_time>=this.jump_timer) {
            this.jump = false;
            this.jump_time = 0; 
            this.jump_vector.clear();
            this.airtime=0;
        }

    }

    handle_gravity() {
        super.handle_gravity();

    }

    
}