import { CollisionArea } from "../../collision/collision.js";
import Body from "../../entities/bodies/body.js";
import Geometry from "../../geometry/geometry.js";
import Utils from "../../utils.js";
import Sprite from "../../visuals/sprite.js";

export default class Ennea extends Body {
    /**@type {Body[]} */
    static #list = [];
    
    #idx;
    #id;

    static #created_count;
    
    collected = false;

    constructor(x,y) {
        const w = 50;
        const h = w;
        const collision_mesh = Geometry.generate_rect_mesh(x,y,w,h,"center")
        const collision_area = new CollisionArea(collision_mesh);
        super(x,y,collision_area);
        this.#idx = Ennea.#created_count;
        this.#id = Ennea.name + ":" + this.#idx;
        Ennea.#created_count++;
        Ennea.#list.push(this);
        this.sprite = new Sprite(Sprite.sprites_folder+"/ennea_sprite.png",w,h,"center");
        //this.sprite.border=true;
    }

    physics() {
        super.physics();
        this.handle_collection();
    }

    static get_body_list() {
        return Ennea.#list;
    }

    handle_collection() {
        if (!this.collected) {return;}
        if (!this.sprite) {return;}

        if (this.collision_area) {
            this.start_fly = false;
            this.fly_speed = 1;
            this.scale_speed = .035;
        }

        this.collision_area = null;
        
        let da = .001;
        if (this.sprite.angle==0) {
            this.sprite.angle_speed=-1;
        }
        this.sprite.angle_speed=Utils.clamp(-10000,this.sprite.angle_speed+da,1);
        
        if (this.sprite.angle<=-20) {
            this.start_fly=true;
            this.scale_speed = -.055;
        }
        //console.log(this.sprite.angle)//,this.sprite.angle_speed);
        //console.log(this.start_fly);
        this.y-=this.fly_speed;
        this.x+=this.fly_speed*2;
        
        if (this.start_fly) {
            this.fly_speed+=.5;
            this.sprite.opacity = Utils.clamp(0,this.sprite.opacity-.035,1);
        }
        this.sprite.scale = Utils.clamp(0,this.sprite.scale+this.scale_speed,2.5);

        if (this.sprite.scale==0) {
            this.sprite=null;
        }
    }
}