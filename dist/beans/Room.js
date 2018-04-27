'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Room = function () {

  //房间名称
  function Room(id) {
    _classCallCheck(this, Room);

    this.users = {};
    this.lines = [];

    this.id = id;
  }

  //房间加多一个人


  // 创建者


  _createClass(Room, [{
    key: 'join',
    value: function join(user) {
      if (user.nickName) {
        this.users[user.nickName] = user;
      }

      console.log('@@##room ' + this.id + ' has ' + this.users.length);
    }
  }, {
    key: 'leave',
    value: function leave(user) {
      if (user.nickName) {
        delete this.users[user.nickName];
      }
    }
  }, {
    key: 'resetGame',
    value: function resetGame() {}
  }, {
    key: 'updateGame',
    value: function updateGame() {}
  }, {
    key: 'sendGameData',
    value: function sendGameData() {}
  }], [{
    key: 'hasRooms',
    value: function hasRooms(rooms, id) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = rooms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          console.log('@@##rooms id ' + item.id);
          if (id == item.id) {
            return item;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return null;
    }
  }]);

  return Room;
}();

exports.default = Room;
//# sourceMappingURL=Room.js.map