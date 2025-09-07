export default class Collision {
    static is_position_within_circle(x,y,cx,cy,r) {
        const relx = x-cx;
        const rely = y-cy;
        return (relx*relx + rely*rely <= r*r);
    }
}