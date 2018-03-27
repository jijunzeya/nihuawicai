
import Touch from './touch';
import Draw from './draw';
// import Line from './model/line';

class Game {
    // lines = [];
    constructor(canvas, socket, callback) {
        this.canvas = canvas;
        this.socket = socket;
        this.draw = new Draw(canvas);
        // this.draw.test();
        this.lines = [];
        this.line = null;
        this.touch = new Touch(canvas, point => {
            console.log('@@##touch result :' + JSON.stringify(point));
            // if (point && point.type === 'start' && !this.line) {
            //     this.line = new Line(point.id);
            //     this.line.addPoint(point);
            //     this.lines.push(Object.assign({}, this.line));
            // } else if (point && point.type === 'move' && this.line) {
            //     this.line.addPoint(point);
            // } else if (point && point.type === 'end' && this.line) {
            //     this.line.addPoint(point);
            //     // this.lines.push(this.line);
            //     this.line = null;
            //     console.log('@@##lines end:' + JSON.stringify(this.lines));
            // }
            // this.draw.draw(point);
            this.socket.emit('pointData', point);
        })
    }

    initEvent (canvas) {

    }

    // 接收socket数据
    receivePointData (data) {
        this.draw.draw(data);
    }

    receiveLineData (data) {
        this.draw.drawLines(data);
    }

    update () {

    }

    draw () {

    }

    backDraw () {
        // this.lines.pop();
        // console.log('@@##backDraw' + JSON.stringify(this.lines));

        // this.draw.drawLines(this.lines);
        this.socket.emit('gameEvent', { action: 'back' });
    }
}

export default Game;
