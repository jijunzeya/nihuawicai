"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Line = function () {
    function Line(id) {
        _classCallCheck(this, Line);

        this.id = id;
        this.points = [];
    }

    _createClass(Line, [{
        key: "addPoint",
        value: function addPoint(point) {
            point.line = this.id;
            this.points.push(point);
        }

        // 回退所画足迹

    }, {
        key: "deleteLine",
        value: function deleteLine() {
            this.points = [];
        }
    }]);

    return Line;
}();

exports.default = Line;
//# sourceMappingURL=Line.js.map