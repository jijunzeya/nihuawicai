'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function () {

  //所在房间id

  //实例属性
  function User(id, nick, token) {
    _classCallCheck(this, User);

    this.id = id;
    this.nickName = nick;
    this.token = token;
  }

  //昵称


  //私有属性


  _createClass(User, [{
    key: 'getID',
    value: function getID() {
      return this.id;
    }
  }, {
    key: 'toString',
    value: function toString() {
      console.log('User toString:' + User.toString());
    }
  }]);

  return User;
}();

User.staticPro = '静态属性User';

exports.default = User;
//# sourceMappingURL=User.js.map