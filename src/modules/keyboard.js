

const keyboard = {
    /**@type {String[]} */
    down:[],
    pressed:[],
    is_down:(key)=>{
        for (let i=0; i<keyboard.down.length; i++) {
            if (keyboard.down[i].toLowerCase()==key.toLowerCase()) {
                return true;
            }
        }

        return false;
    },
    is_pressed:(key)=>{
        if (keyboard.is_down(key)) {
            for (let i=0; i<keyboard.pressed.length; i++) {
                if (keyboard.pressed[i].toLowerCase()==key.toLowerCase()) {
                    return false;
                }
            }
            let exists = false;

            for (let j=0; j<keyboard.pressed.length; j++) {
                if (keyboard.pressed[j].toLowerCase()==key.toLowerCase()) {
                    exists = true;
                    break;
                }
            }

            if (!exists) {
                keyboard.pressed.push(key);
            }
            return true;
        }
        return false;
    },
}
export default keyboard;

addEventListener("keydown",e=>{
    const key = e.key;

    if (!keyboard.is_down(key)) {
        keyboard.down.push(key);
    }
})

addEventListener("keyup",e=>{
    const up = e.key;
    keyboard.down = keyboard.down.filter(k=>{return k.toLowerCase()!=up.toLowerCase()})
    keyboard.pressed = keyboard.pressed.filter(k=>{return k.toLowerCase()!=up.toLowerCase()})
})