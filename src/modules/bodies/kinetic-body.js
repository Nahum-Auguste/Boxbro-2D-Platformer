import Body from "./body.js";

export default class KineticBody extends Body {
    class_name = KineticBody;
    /**@type {KineticBody[]} */
    static #entity_list = [];
    class_nickname = "KB";

    #idx;
    #id;

    constructor(x,y,collision_area) {
        super(x,y,collision_area);
        this.class_name.#entity_list.push(this);
        this.#idx = this.class_name.#entity_list.length-1;
        this.#id = this.class_nickname + this.#idx;
    }

    static get_entity_list() {
        return KineticBody.#entity_list;
    }

    get_id() {
        return this.#id;
    }
}