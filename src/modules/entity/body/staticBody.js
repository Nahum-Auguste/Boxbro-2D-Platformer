import Body from "./body.js";
import CollisionArea from "../../area/collisionArea.js";

export default class StaticBody extends Body{

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {CollisionArea} collisionArea 
     */
    constructor(x,y,collisionArea) {
        super(x,y,collisionArea);
    }
}