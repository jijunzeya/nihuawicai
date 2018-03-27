
class Point {
    id;
    action;
    type; // 'start',
    x;
    y;
    constructor(id, action, type, x, y) {
        this.id = id;
        this.action = action;
        this.type = type;
        this.x = x;
        this.y = y;
    }
}

export default Point;
