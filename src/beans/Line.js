
export default class Line {
    id;
    points;

    constructor(id) {
        this.id = id;
        this.points = [];
    }

    addPoint (point) {
        point.line = this.id;
        this.points.push(point);
    }

    // 回退所画足迹
    deleteLine () {
        this.points = [];
    }
}
