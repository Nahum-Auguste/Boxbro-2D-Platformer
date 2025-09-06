
export default class Entity {
    static #entities = [];
    x;
    y;
    #index;
    #id;
    name;

    constructor (x,y) {
        Entity.#entities.push(this);
        this.x = x;
        this.y = y;
        
        
        this.#index = Entity.#entities.length-1;
        this.#id = "entity:" + this.#index;
    }

    static getEntityCount() {
        return this.#entities.length;
    }

    getId() {
        return this.#id;
    }

    static getEntityList() {
        return Entity.#entities;
    }

    destroy() {
        Entity.#entities = Entity.#entities.filter(e=> e!==this);
    }
} 