
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

}