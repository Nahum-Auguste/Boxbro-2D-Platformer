import Draw from "./modules/draw.js";
import canvas from "./modules/canvas.js";
import {ctx} from "./modules/canvas.js";
import mouse from "./modules/peripherals/mouse.js";
import keyboard from "./modules/peripherals/keyboard.js";
import Geometry from "./modules/geometry/geometry.js";
import Collision from "./modules/collision/collision.js";
import KineticBody from "./modules/entities/bodies/kineticBody.js";
import StaticBody from "./modules/entities/bodies/staticBody.js";
import Vector from "./modules/geometry/vector.js";


// Document Variables
const body = document.getElementsByTagName("body")[0];
const sky_color = "rgba(255, 255, 255, 1)";


// Debugging Variables
const debug_mode = true;
const debug_array = [];

//50,50,100,50 (h l->r)
//100,50,50,50 (h r->l)
//50,50,100,100 (diag top l->r)
//50,100,100,50 (diag bot l->r)
//100,50,50,100 (diag top r->l)
//100,100,50,50 (diag bot r->l)
//50,50,50,100 (v t->b)
//50,100,50,50 (v b->t)

const p1 = new Geometry.Point(50,50);
const p2 = new Geometry.Point(100,150);
const line = new Geometry.Line({},100,50,50,50);
const line2 = new Geometry.Line({},100,100,50,50);

//const square = Collision.generate_collision_area(Geometry.generate_rect_mesh(x,y,w,h));
//square.print();

const px = 150;
const py = 70;
//const playa = new KineticBody(px,py,Collision.generate_collision_area(Geometry.generate_mesh([[50,50],[150,50]])));
const playa = new KineticBody(px,py,Collision.generate_collision_area(Geometry.generate_rect_mesh(px,py,50,50,"center")));
playa.gravity_y = 18;
//playa.collision_area.mesh.print_vertices();

const sx = 50;
const sy = 260;
const sw = 470;
const sh = 70;
const stat = new StaticBody(sx,sy,Collision.generate_collision_area(Geometry.generate_rect_mesh(sx,sy,sw,sh)))
const stat2 = new StaticBody(sx+600,sy-50,Collision.generate_collision_area(Geometry.generate_rect_mesh(sx+600,sy-50,100,sh)))

function debug() {
    //console.log(mouse.get_position());
    //square.print();
    if (playa.velocity.magnitude()!=0) {
        //playa.future_self.collision_area.draw("rgba(123, 255, 213, 0.89)");
        //playa.future_collision_area.handle_debug_mode();
        //console.log(2); 
    }
    //console.log(playa);
    
    const options = {vertex_names:false,edge_names:false};
    playa.handle_debug_mode(options);
    //console.log("grounded:",playa.grounded);
    
    //playa.collision_area.mesh.get_lowest_edge().draw(1,"red");
    //square.handle_debug_mode();
    //playa.handle_collision();
    stat.handle_debug_mode(options);
    stat2.handle_debug_mode(options);
    playa.physics();
    if (playa.collision_area.mesh.get_highest_vertex().y>canvas.height) {
        //playa.x = sx;
        //console.log(2);
        
        //playa.y = sy
    }
   // console.log(playa.jump_last_velocity);
    
    //console.log(playa.is_colliding());
    debug_array[0] = "grounded: " + playa.grounded;
    debug_array[1] = "airtime: " + playa.airtime;
    debug_array[2] = "jumptime: " + playa.jumptime;
    let debug_text = "";
    debug_array.forEach(e=>{
        debug_text+=e+"\n";
    })
    const debug_element = document.getElementById("debug");
    if (debug_element) {
        debug_element.innerText = debug_text;
    }
    //console.log(playa.future_self.x,playa.x);
    
    
    //console.log(keyboard.down);
    
    //console.log(Geometry.point_projection_to_line({line},mouse.x,mouse.y));
    
    //console.log(line.intersects(line2,true));
    
    

    //console.log(mouse.held_obj_data);

    //line.draw();
    //console.log(Collision.is_point_to_left_of_line(mouse.x,mouse.y,{line,range:40}));
    
    
    
    //Draw.grid(canvas.width/50,"rgba(50, 85, 200, 0.15)");
}

// Execution
const main = ()=> {
    create_debug_elements();
    loop();
}
main();

function loop() {
    
    playa.spd = 5;
    if (keyboard.down.includes("w")) {
        //playa.velocity.y-=spd;
    }
    if (keyboard.down.includes("s")) {
        playa.velocity.y+=playa.spd;
    }
    if (keyboard.down.includes("a")) {
        playa.velocity.x-=playa.spd;
    }
    if (keyboard.down.includes("d")) {
        playa.velocity.x+=playa.spd;
    }
    if (keyboard.down.includes(" ")) {
        playa.handle_jump();
    }
    
    draw();
    debug();

    requestAnimationFrame(loop);
}

// Functions
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //Draw the sky (background)
    Draw.rect(0,0,canvas.width,canvas.height,sky_color);


    //Draw.line(0,0,canvas.width,canvas.height);

}

function create_debug_elements() {
    if (debug_mode) {
        const debug_header = document.createElement("h3");
        debug_header.style.textAlign="center";
        debug_header.style.fontFamily="Arial";
        const debug_element = document.createElement("p");
        debug_element.style.textAlign = "center";
        debug_element.id = "debug";
        debug_element.style.backgroundColor="white";


        debug_header.innerText = "Debuging Messages";
        body.appendChild(debug_header);
        body.appendChild(debug_element);
    }
}
