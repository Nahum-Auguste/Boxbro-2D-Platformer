export default class Utils {
    static clamp(min,val,max) {
        if (val<min) {
            return min;
        }
        if (val>max) {
            return max;
        }

        return val;
    }

    static lerp(a,b,t) {
        return (a-b)*t;
    }

    static to_radians(d) {
        return d * 180 / Math.PI;
    }
}