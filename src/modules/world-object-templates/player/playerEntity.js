import CollisionArea from "../../area/collisionArea.js";
import Keyboard from "../../peripherals/keyboard.js";
import KineticBody from "../../entity/body/kineticBody.js";

export default class PlayerEntity extends KineticBody{
    spd=0;
    collisionEnabled = true;
    movementKeyset;

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {CollisionArea} collisionArea 
     * @param {String[]} movementKeyset
     */
    constructor(x,y,collisionArea,spd=0,movementKeyset=["w","a","s","d"]) {
        super(x,y,collisionArea);
        this.spd = spd;

        this.movementKeyset = [];
        movementKeyset.forEach((e,i)=>{
            this.movementKeyset[i]=e.toLowerCase();
        })
    }

    /**
     * @param {String[]} keyset 
     */
    setMovementKeyset(keyset) {
        if (keyset.length!=4) {console.error("Invalid Keyset Inserted.")}
        keyset.forEach((e,i)=>{
            this.movementKeyset[i]=e[i].toLowerCase();
        })
    }

    doPhysics() {
        this.handleMovement();
    }

    handleMovement() {
        const up = Keyboard.down.includes(this.movementKeyset[0].toLowerCase()) || Keyboard.down.includes(this.movementKeyset[0].toUpperCase());
        const left = Keyboard.down.includes(this.movementKeyset[1].toLowerCase()) || Keyboard.down.includes(this.movementKeyset[1].toUpperCase());
        const down = Keyboard.down.includes(this.movementKeyset[2].toLowerCase()) || Keyboard.down.includes(this.movementKeyset[2].toUpperCase());
        const right = Keyboard.down.includes(this.movementKeyset[3].toLowerCase()) || Keyboard.down.includes(this.movementKeyset[3].toUpperCase());

        const dx = (right-left)*this.spd;;
        const dy = (down-up)*this.spd;

        this.move(dx,dy);
    }
}