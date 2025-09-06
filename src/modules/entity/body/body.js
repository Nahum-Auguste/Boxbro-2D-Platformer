import Entity from "../entity.js";
import CollisionArea from "../../area/collisionArea.js";
import Mouse from "../../peripherals/mouse.js";
import * as Utils from "../../utils.js";
import * as Draw from "../../draw.js";

export default class Body extends Entity{
    sprite;
    drawings = [];
    debugEnabled = false;
    collisionEnabled = true;
    collisionArea;
    mesh;

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {CollisionArea} collisionArea 
     */
    constructor(x,y,collisionArea) {
        super(x,y);
        this.collisionArea = collisionArea;
        this.mesh = this.collisionArea.mesh;
    }

    setSprite(sprite) {
        this.sprite = sprite;
    }

    setDrawing(drawing) {
        this.drawings = [drawing];
    }

    draw() {
        this.drawings.forEach(d=>{
            d.draw();
        });
    }

    doPhysics() {
        this.handleCollision(this.isColliding());
    }

    isCollidingWith(e) {     
        return this.collisionArea.isCollidingWith(e);
    }

    isColliding() {
        let result = false;
        const entityList = Entity.getEntityList(); 
        entityList.forEach(e=>{
            if (e!=this && e instanceof Body){  
                
                if (result = this.isCollidingWith(e)) {   
                    //console.log(this.getId(),"is colliding with",e.getId());
                    return result;
                }
            }
        });
        return result;
    }

    handleCollision() {
        
    }

    drawCollisionArea() {
        if (!this.collisionArea) {return;}
        this.collisionArea.debug_draw();
    }

    printCollisionValues() {
        if (!this.collisionArea) {return;}
        this.collisionArea.printValues();
    }

    handleCollisionDebugMode() {
        if (!this.collisionArea) {return;}
        this.collisionArea.handleDebugMode();
    }

    isMouseColliding() {
        if (this.collisionArea) {
            
            return this.collisionArea.isMouseColliding();
        }
        return false;
    }

    handleDrawingDebugMode() {
        this.drawings.forEach(d=>{
            d.handleDebugMode();
        });
    }

    handleDebugMode() {
        this.handleCollisionDebugMode();
        this.handleDrawingDebugMode();

        if (this.isMouseColliding()) {
            if (Mouse.held.length==0 && Mouse.down) {
                Mouse.held.push(this);
            }
            if (Mouse.held.includes(this)) {
                Mouse.moveObject(this);
                if (this.collisionArea) {
                    this.collisionArea.mesh.vertices.forEach(v=>{
                        Mouse.moveObject(v);
                    });
                }
                this.drawings.forEach(d=>{
                    d.layers.forEach(l=>{
                        if (l==0) {return;}
                        l.mesh.vertices.forEach(v=> {
                            Mouse.moveObject(v);
                        });
                    });
                    d.mesh.vertices.forEach(v=> {
                        Mouse.moveObject(v);
                    });
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
}