

export function isPointsIntersecting(x1,y1,x2,y2,range=0) {
    const dx = x2-x1;
    const dy = y2-y1;

    if ((dx*dx + dy*dy)<=(range*range)) {
        return true;
    }

    return false;
}

/**
 * Order from top two points to bottom two.
 * @param {*} px 
 * @param {*} py 
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 * @param {*} offset 
 * @returns 
 */


export function clamp(min,val,max) {
    if (val<min) {
        return min;
    }
    if (val>max) {
        return max;
    }
    return val;
}

export function midPoint(x1,y1,x2,y2) {
    return {x:(x2+x1)/2,y:(y2+y1)/2}
}

export function pointsDistance(x1,y1,x2,y2) {
    const dx = x2-x1;
    const dy = y2-y1;
    return Math.sqrt(dx*dx + dy*dy);
}
