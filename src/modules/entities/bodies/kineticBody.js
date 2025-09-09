import Body from "./body.js";
import Draw from "../../draw.js";


export default class KineticBody extends Body {
    static #created_count = 0;
    static #list = [];
    #idx;
    #id;
    #nickname;

    constructor(x,y,collision_area) {
        super(x,y,collision_area);
        this.#idx = KineticBody.#created_count;
        this.#id = KineticBody.name + ":" + this.#idx;
        this.#nickname = "KB" + this.#idx; 
        KineticBody.#created_count++;
        this.collision_area = collision_area;
        KineticBody.#list.push(this);
    }

    static get_created_count() {
        return KineticBody.#created_count;
    }

    static get_body_list() {
        return KineticBody.#list;
    }

    get_nickname() {
        return this.#nickname;
    }

    handle_collision() {
        Body.get_body_list().forEach(b=>{
            if (b==this) {return;}
            if (this.is_colliding_with(b)) {
                //console.log("colliding");
                
            }
        });
    }

    draw_id() {
        Draw.text({x:this.x,y:this.y-5,text:this.#nickname,centered:true});
    }
}
