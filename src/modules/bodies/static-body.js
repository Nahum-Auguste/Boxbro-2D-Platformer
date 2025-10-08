import Body from "./body.js";


export default class StaticBody extends Body {
    class_name = StaticBody;
    /**@type {StaticBody[]} */
    static #entity_list = [];
    class_nickname = "SB";

    #idx;
    #id;

    constructor(x,y,collision_area) {
        super(x,y,collision_area);
        this.class_name.#entity_list.push(this);
        this.#idx = this.class_name.#entity_list.length-1;
        this.#id = this.class_nickname + this.#idx;
    }

    static get_entity_list() {
        return StaticBody.#entity_list;
    }

    get_id() {
        return this.#id;
    }
}