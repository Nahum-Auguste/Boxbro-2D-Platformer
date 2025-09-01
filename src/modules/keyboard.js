

export default {
    down:[],
    up:[],
    setKeyDown: function(down) {
        if(!this.down.includes(down)) {
            this.down.push(down);
        }
        this.up = this.up.filter(k=> k!==down);
    },
    setKeyUp: function(up) {
        if(!this.up.includes(up)) {
            this.up.push(up);
        }
        this.down = this.down.filter(k=> k!==up);
        if (this.down.length==0) {
            this.up = [];
        }
    },
}