'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

// import User from './beans/User';
// import Room from './beans/Room';


var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _ChatHandler = require('./ChatHandler');

var _ChatHandler2 = _interopRequireDefault(_ChatHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SocketHandler = function () {
  function SocketHandler(server, onConnection) {
    var _this = this;

    _classCallCheck(this, SocketHandler);

    this.rooms = {};
    this.chatHandlers = {};

    var io = new _socket2.default(server);
    this.nsp = io.of('/chat');

    // middleware
    // nsp.use((socket, next) => {
    //   let token = socket.handshake.query.token;
    //   console.log('@@##nsp middleware:' + token);
    //   return next();
    //   // if (isValid(token)) {
    //   //   return next();
    //   // }
    //   // return next(new Error('authentication error'));
    // });

    // let nsp =io;
    this.nsp.on('connection', function (socket) {
      _this.socket = socket;
      // let roomId = socket.handshake.query.roomId;
      // let token = sockect.handshake.query.token;
      var data = {
        roomId: socket.handshake.query.roomId,
        token: socket.handshake.query.token,
        name: socket.handshake.query.name
      };
      onConnection(data);
    });
  }

  _createClass(SocketHandler, [{
    key: 'initListeners',
    value: function initListeners(listeners) {
      for (var key in listeners) {
        this.socket.on(key, listeners[key]);
      }
    }
  }, {
    key: 'joinRoom',
    value: function joinRoom(roomId, callback) {
      if (this.socket) {
        this.socket.join(roomId, callback);
      } else {
        throw new Error('socket is not initial');
      }
    }

    //改变房间

  }, {
    key: 'chanageRoom',
    value: function chanageRoom(oldRoomId, newRoomId, callback) {}
  }, {
    key: 'getNsp',
    value: function getNsp() {
      return this.nsp;
    }
  }, {
    key: 'getSocket',
    value: function getSocket() {
      return this.socket;
    }
  }, {
    key: 'sendMessageToRoom',
    value: function sendMessageToRoom(room, event, message) {
      //发消息到房间还是给人呢
      this.nsp.to(room).emit(event, message);
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(event, message) {
      this.socket.emit(event, message);
    }
  }, {
    key: 'init',
    value: function init(func) {}
  }]);

  return SocketHandler;
}();

exports.default = SocketHandler;
//# sourceMappingURL=SocketHandler.js.map