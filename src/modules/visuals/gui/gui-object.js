

export default class GuiObject {
    /**@type {GuiObject[]} */
    static #entity_list = [];

    constructor() {
        GuiObject.#entity_list.push(this);
    }

    static get_entity_list() {
        return GuiObject.#entity_list;
    }
}