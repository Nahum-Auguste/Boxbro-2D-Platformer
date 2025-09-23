

const keyboard = {
    down:[],
    up:[],
    down_has: /**@param {string} key**/(key)=>{
        for (let i=0; i<keyboard.down.length; i++) {
            /**
             * @type {string}
             */
            const d = keyboard.down[i];
            if (d.toLowerCase()===key.toLowerCase()) {
                return true;
            }
        }

        return false;
    },

}
export default keyboard;


addEventListener("keydown",e=>{
    const key = e.key;

    if (!keyboard.down.includes(key)) {
        keyboard.down.push(key);
    }

    keyboard.up = keyboard.up.filter(v=> v.toLowerCase() !== key.toLowerCase());
});

addEventListener("keyup",e=>{
    const key = e.key;

    if (!keyboard.up.includes(key)) {
        keyboard.up.push(key);
    }

    keyboard.down = keyboard.down.filter(v=> v.toLowerCase() !== key.toLowerCase());
    if (keyboard.down.length==0) {
        keyboard.up = [];
    }
});


