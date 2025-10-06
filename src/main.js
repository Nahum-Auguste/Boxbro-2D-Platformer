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
import Player from "./modules/world-assets/entities/player.js";
import Body from "./modules/entities/bodies/body.js";
import DebugBlock1 from "./modules/world-assets/objects/debug-block1.js";
import DebugBlock2 from "./modules/world-assets/objects/debug-block2.js";
import camera from "./modules/camera.js";
import Utils from "./modules/utils.js";
import Ennea from "./modules/world-assets/collectibles/ennea.js";
import Sprite from "./modules/visuals/sprite.js";

// World objects
let sx = 70;
let sy = 170;
const player = new Player(sx,sy);
new DebugBlock1(30,300);
new DebugBlock1(200,250);
new DebugBlock2(470,300);
new Ennea(400,150);
new Ennea(400,200);
new Ennea(700,250);

// Sprites for GUI
const gui_sprite_size = 30;
const ennea_sprite = new Sprite("../images/sprites/ennea_sprite.png",gui_sprite_size,gui_sprite_size);

// Document Variables
const body = document.getElementsByTagName("body")[0];
const sky_color = "rgba(183, 230, 255, 1)";

// Debugging Variables
const debug_mode = true;



// Execution
const main = ()=> {
    camera.init();
    create_debug_elements();
    loop();
}
main();

function loop() {
    
    
    physics();
    draw();
    debug();
    gui();
    handle_camera();
    

    requestAnimationFrame(loop);
}

// Functions
function handle_camera() {
    const box = camera.get_box();
    const target = player;
    const cx = target.collision_area.mesh.get_leftmost_vertex().x + target.collision_area.mesh.get_width()/2;
    const cy = target.collision_area.mesh.get_highest_vertex().y + target.collision_area.mesh.get_height()/2;
    const upper_bound = box.y+(box.height/2);
    const lower_bound = box.y+(box.height*.9);
    let left_bound = box.x + box.width/3;
    let right_bound = box.x + box.width*.3
    let follow_const = .05;

    if (mouse.is_holding(target)!=-1) {
        follow_const=.9;
        left_bound = box.x + box.width*.1;
        right_bound = box.x + box.width*.9; 
        //console.log(cx-left_bound,right_bound-cx);
    }

    const ushift = Utils.lerp(upper_bound,cy,follow_const);
    const bshift = Utils.lerp(lower_bound,cy,follow_const);
    const lshift = Utils.lerp(left_bound,cx,.1);//follow_const);
    const rshift = Utils.lerp(right_bound,cx,.1);//follow_const);
    //console.log(lshift,rshift);
    //console.log(bshift);
    
    
    //console.log(rshift);
    
    //console.log(left_bound,cx,right_bound);
    
    if (cx>=right_bound) {
        camera.move(rshift,0);
        //console.log("to roght");
        
    }
    else if (cx<=left_bound) {
        camera.move(lshift,0);
        //console.log("to left");
    }

    if (cy>=lower_bound) {
        camera.move(0,bshift);
    }
    else {
        camera.move(0,ushift);
    }

    if (camera.zoom_text_life_time>0) {
        Draw.text({size:20/camera.get_zoom(),text:camera.get_zoom().toFixed(2),x:box.x+(10/ctx.getTransform().a),y:box.y+(20/ctx.getTransform().d),color:`rgba(0,0,0,${camera.zoom_text_life_time/camera.zoom_text_life_timer})`});
    }
    camera.zoom_text_life_time = Utils.clamp(0,camera.zoom_text_life_time-1,camera.zoom_text_life_time);
    //console.log(camera.zoom_text_life_time);
    
}

function gui() {
    const box = camera.get_box();
    const zoom = camera.get_zoom();
    const zf = 1/zoom;
    const ennea_count = player? player.ennea_count : 0;
    ennea_sprite.draw(box.x+(10)*zf,box.y+(10)*zf);
    ennea_sprite.scale = zf;
    Draw.text({size:25/zoom,x:box.x+(gui_sprite_size+10+5)*zf,y:box.y+(gui_sprite_size+2)*zf,text:ennea_count});
}

function draw() {
    const box = camera.get_box();
    const draw = !false;

    ctx.clearRect(box.x,box.y,box.width,box.height);
    
    //Draw the sky (background)
    if (draw) {
        Draw.rect(box.x,box.y,box.width,box.height,sky_color);

        //Draw the world
        Body.get_body_list().forEach(b=>{
            b.draw();
        })
    }
    else {
        Draw.rect(box.x,box.y,box.width,box.height,"white");
    }
}

function physics() {
    Body.get_body_list().forEach(b=>{
        const options = {vertex_names:false,edge_names:false};
        b.physics();
    })
}

function debug() {
    const box = camera.get_box();
    //50,50,100,50 (h l->r)
    //100,50,50,50 (h r->l)
    //50,50,100,100 (diag top l->r)
    //50,100,100,50 (diag bot l->r)
    //100,50,50,100 (diag top r->l)
    //100,100,50,50 (diag bot r->l)
    //50,50,50,100 (v t->b)
    //50,100,50,50 (v b->t)

    //console.log(keyboard.down);

    camera.draw_border();
    

    Body.get_body_list().forEach(b=>{
        const options = {vertex_names:false,edge_names:false};
        //b.handle_debug_mode(options);
    })

    const debug_array = [
        "grounded: " + player.grounded,
        "airtime: " + player.airtime,
        "jumptime: " + player.jumptime,
        "spd: " + player.spd,
        "sprinting: " + player.sprinting,
    ];

    let debug_text = "";
    debug_array.forEach(e=>{
        debug_text+=e+"\n";
    })
    const debug_element = document.getElementById("debug");
    if (debug_element) {
        debug_element.innerText = debug_text;
    }

    const room_end_y = 1000;
    if (player.collision_area.mesh.get_highest_vertex().y>room_end_y) {
        player.move_to(sx,sy);
        //ctx.setTransform(1,0,0,1,sx,0);
    }

    
   //Draw.grid(canvas.width/50,"rgba(50, 85, 200, 0.25)");
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
