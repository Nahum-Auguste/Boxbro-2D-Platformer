import Draw from "../draw.js";
export default class Entity {
    static #created_count = 0;
    static #list = []
    #idx;
    #id;
    #nickname;
    x;
    y;

    constructor (x,y) {
        this.#idx = Entity.#created_count;
        this.#id = Entity.name + ":" + this.#idx;
        this.#nickname = "E" + this.#idx; 
        Entity.#created_count++;
        this.x = x;
        this.y = y;
        Entity.#list.push(this);
    }

    static get_created_count() {
        return Entity.#created_count;
    }

    static get_entity_list() {
        return Entity.#list;
    }

    get_id() {
        return this.#id;
    }

    get_nickname() {
        return this.#nickname;
    }


    draw_id() {
        Draw.text({x:this.x,y:this.y-5,text:this.#nickname,centered:true});
    }

    handle_debug_mode() {
        Draw.point_extra({x:this.x,y:this.y,color:"white"});
        Draw.circle(this.x,this.y,3,"black",false,2);
        this.draw_id();
    }

    move_to(x,y) {
        this.x = x;
        this.y = y;
    }
}