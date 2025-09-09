import Body from "./body.js";
import Draw from "../../draw.js";


export default class StaticBody extends Body {
    static #created_count = 0;
    static #list = [];
    #idx;
    #id;
    #nickname;

    constructor(x,y,collision_area) {
        super(x,y,collision_area);
        this.#idx = StaticBody.#created_count;
        this.#id = StaticBody.name + ":" + this.#idx;
        this.#nickname = "SB" + this.#idx; 
        StaticBody.#created_count++;
        this.collision_area = collision_area;
        StaticBody.#list.push(this);
    }

    static get_created_count() {
        return StaticBody.#created_count;
    }

    static get_body_list() {
        return StaticBody.#list;
    }

    get_nickname() {
        return this.#nickname;
    }

    handle_collision() {
        Body.get_body_list().forEach(b=>{
            if (b==this) {return;}
        });
    }

    draw_id() {
        Draw.text({x:this.x,y:this.y-5,text:this.#nickname,centered:true});
    }
}
