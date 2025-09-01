import CollisionArea from "../collision/collision-area.js";
import Mouse from "../mouse.js";
import * as Utils from "../utils.js";
import * as Draw from "../draw.js";
import Keyboard from "../keyboard.js";
import Geometry from "../geometry/geometry.js";

export default class PlayerObject {
    x;
    y;
    spd=0;
    collisionArea;
    collisionEnabled = true;
    debugEnabled = false;
    movementKeyset;
    movementVector = Geometry.generateVector();

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {CollisionArea} collisionArea 
     * @param {String[]} movementKeyset
     */
    constructor(x,y,collisionArea,spd=0,movementKeyset=["w","a","s","d"]) {
        this.x=x;
        this.y=y;
        this.collisionArea = collisionArea;
        this.spd = spd;

        this.movementKeyset = [];
        movementKeyset.forEach((e,i)=>{
            this.movementKeyset[i]=e.toLowerCase();
        })
    }

    drawCollisionArea() {
        this.collisionArea.draw();
    }

    printCollisionValues() {
        this.collisionArea.printValues();
    }

    /**
     * 
     * @param {String[]} keyset 
     */
    setMovementKeyset(keyset) {
        if (keyset.length!=4) {console.error("Invalid Keyset Inserted.")}
        keyset.forEach((e,i)=>{
            this.movementKeyset[i]=e[i].toLowerCase();
        })
    }

    /**
     * 
     * @param {MouseEvent} event 
     */
    handleDebugMode() {
        if (this.debugEnabled==false) {return;}
        const m = Mouse.getPosition();

        this.collisionArea.mesh.vertices.forEach(v=> {
            if (Utils.isPointsIntersecting(v.x,v.y,m.x,m.y,5)) {
                v.color = v.hoverColor;
                //console.log(v.id);
                
                if (Mouse.held.length==0 && Mouse.down) {
                    Mouse.held.push(v);
                }
            }
            else {
                v.color = v.baseColor;
            }

            if (Mouse.held.includes(v)) {
                //console.log(v.id);
                Mouse.moveObject(v);
                this.collisionArea.mesh.orientEdges();
            }
        });

        if (this.collisionArea.isMouseColliding()) {
            if (Mouse.held.length==0 && Mouse.down) {
                Mouse.held.push(this);
            }
            if (Mouse.held.includes(this)) {
                Mouse.moveObject(this);
                this.collisionArea.mesh.vertices.forEach(v=>{
                    Mouse.moveObject(v);
                });
            }
        }
        //console.log("mousecolliding:",this.collisionArea.isMouseColliding());
        //console.log(this.collisionArea.getHeight());
        
        //console.log(this.x,this.y);
        
        Draw.circle(this.x,this.y,5,"green",false);
        Draw.circle(this.x,this.y,1.5,"orange",true);
        Draw.circle(this.x,this.y,1.5,"black",false);
        if (Mouse.held.includes(this)) {
            Draw.circle(this.x,this.y,5,"white",false);
            Draw.circle(this.x,this.y,6,"black",false);
        }

    }

    doPhysics() {
        this.handleMovement();
    }

    handleMovement() {
        const up = Keyboard.down.includes(this.movementKeyset[0]);
        const left = Keyboard.down.includes(this.movementKeyset[1]);
        const down = Keyboard.down.includes(this.movementKeyset[2]);
        const right = Keyboard.down.includes(this.movementKeyset[3]);

        
        this.movementVector.x = (right-left)*this.spd;
        this.movementVector.y = (down-up)*this.spd;
        this.movementVector.normalize();
        const dx = this.movementVector.x;
        const dy = this.movementVector.y;
        //console.log(this.movementVector);

        this.y+=dy
        this.collisionArea.movePositionsDown(dy);
        this.x+=dx;
        this.collisionArea.movePositionsRight(dx);

    }
}