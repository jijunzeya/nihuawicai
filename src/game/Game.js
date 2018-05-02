
import Room from '../beans/Room';
import Line from '../beans/line';
import Point from '../beans/Point';
export default class Game {
  line;
  callback;
  lines = [];
  constructor(callback) {
    // this.room = room;
    this.callback = callback;
    this.handleData.bind(this);
    this.handleGameEvent.bind(this);
  }

  handleData (point) {
    if (point && point.type === 'start' && !this.line) {
      this.line = new Line(point.id);
      this.line.addPoint(point);
      this.lines.push(Object.assign({}, this.line));
    } else if (point && point.type === 'move' && this.line) {
      this.line.addPoint(point);
    } else if (point && point.type === 'end' && this.line) {
      this.line.addPoint(point);
      // this.lines.push(this.line);
      this.line = null;
      console.log('@@##lines end:' + JSON.stringify(this.lines));
    }
    let event = {
      name: 'gamePointData',
      data: point
    }
    this.callback && this.callback(event);
  }

  handleGameEvent (event) {
    if (event && event.action == 'back') {
      this.lines.pop();
      this.callback && this.callback({
        name: 'gameLinesData',
        data: this.lines
      })
    }
  }



}