

const keyboard = {
    /**@type {String[]} */
    down:[],
    is_down:(key)=>{
        for (let i=0; i<keyboard.down.length; i++) {
            if (keyboard.down[i].toLowerCase()==key.toLowerCase()) {
                return true;
            }
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
})