'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Room = require('../beans/Room');

var _Room2 = _interopRequireDefault(_Room);

var _line = require('../beans/line');

var _line2 = _interopRequireDefault(_line);

var _Point = require('../beans/Point');

var _Point2 = _interopRequireDefault(_Point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
  function Game(callback) {
    _classCallCheck(this, Game);

    this.lines = [];

    // this.room = room;
    this.callback = callback;
  }

  _createClass(Game, [{
    key: 'handleData',
    value: function handleData(point) {
      if (point && point.type === 'start' && !this.line) {
        this.line = new _line2.default(point.id);
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
      var event = {
        name: 'gamePointData',
        data: point
      };
      this.callback && this.callback(event);
    }
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(event) {
      if (event && event.action == 'back') {
        this.lines.pop();
        this.callback && this.callback({
          name: 'gameLinesData',
          data: this.lines
        });
      }
    }
  }]);

  return Game;
}();

exports.default = Game;
//# sourceMappingURL=Game.js.map