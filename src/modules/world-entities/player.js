import KineticBody from "../bodies/kinetic-body.js";
import Vector from "../geometry/vector.js";
import keyboard from "../keyboard.js";
import Utils from "../utils.js";
import CollisionArea from "../collision/collision-area.js";
import RectShape from "../geometry/shapes/rect-shape.js";



class Player extends KineticBody {
    base_spd;
    spd = this.base_spd;

    //jump_timer = 10;
    //jump_time = 0;
    jump = false;
    jump_initial_velocity = new Vector(0,-15);
    jump_velocity = new Vector(0,0);
    jump_velocity_decay = new Vector(.02,.15);
    jump_held = false;

    movement_vector = new Vector(0,0);

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
        const jump_key = keyboard.is_down(" ");


        const sprint = keyboard.is_down("shift")// && this.grounded;
        const sprint_mult = 1.4;

        if (jump_key && this.grounded) {
            this.jump_held = true;
        }


        if (!jump_key && !this.grounded) {
            this.jump_held = false;
        }
        

        const start_jump = (this.jump_held);

        this.spd = this.base_spd;
        this.spd = sprint? this.base_spd*sprint_mult : this.spd;

        let dx = (right - left) * this.spd;
        let dy = 0;// = (down - up) * this.spd;

        this.movement_vector = new Vector(dx,dy).normalized();

        

        this.move(this.movement_vector.x,this.movement_vector.y);

        if (this.grounded && start_jump) {
            
            this.grounded = false;
            this.jump = true;
            this.jump_initial_velocity.x = dx*.4// //+ (this.velocity.x)*.7 - this.jump_velocity.x;
            this.jump_initial_velocity.x = sprint? this.jump_initial_velocity.x : this.jump_initial_velocity.x;
            
            this.jump_velocity.x = this.jump_initial_velocity.x;
            this.jump_velocity.y = this.jump_initial_velocity.y;
            //console.log(this.jump_charge/this.max_jump_charge);
            
        }
    }

    handle_jump() {

        //increment jump timer while in jump state
        if (this.jump) {
            //this.jump_time++;
            this.gravity.clear();
        }

        //if timer is finished
        if ((this.jump_velocity.y==0) && this.jump) {
            this.jump = false;
            //this.jump_time = 0; 
            this.airtime=10;
            this.jump_velocity.y=0;

            //clear vertical jump velocity after timer is done
            //this.jump_velocity.y=0;
        }

        //clear jump horizontal velocity when touch the ground
        if (this.grounded) {
            this.jump_velocity.x=0;
            this.jump_initial_velocity.x = 0;
        }

        const jvd = this.jump_velocity_decay;
        //const jt = this.jump_time;
        const ij = this.jump_initial_velocity;

        //edit jump velocity x
        const powx = 2;
        const signx = ij.x? (powx%2==0? (ij.x/Math.abs(ij.x)): 1) : 1;
        const minx = -Math.abs(ij.x*3);
        const maxx = Math.abs(ij.x*3);
        const decayx = Math.pow(this.airtime*jvd.x,powx);

        
        this.jump_velocity.x = signx<0? Utils.clamp(minx, this.jump_velocity.x + decayx, 0) : Utils.clamp(0, this.jump_velocity.x - decayx, maxx);

        //edit jump velocity y
        const powy = 2;
        const signy = powy%2==0? (ij.y/Math.abs(ij.y)): 1;
        const miny = ij.y*3;
        const maxy = 0;
        const jy = this.jump_velocity.y-Math.pow(this.airtime *jvd.y,powy)*signy;

        
        this.jump_velocity.y = Utils.clamp(miny, jy, maxy);


        this.move(this.jump_velocity.x,this.jump_velocity.y);

    }

    handle_gravity() {
        super.handle_gravity();

    }

    update_velocity() {
        super.update_velocity();
        this.velocity.add(this.movement_vector);
        this.velocity.add(this.jump_velocity);
    }

    
}

const player = new Player(250,100, new CollisionArea(200,100,new RectShape(50,50)),4);
export default player;