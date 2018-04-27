'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _User = require('../beans/User');

var _User2 = _interopRequireDefault(_User);

var _Room = require('../beans/Room');

var _Room2 = _interopRequireDefault(_Room);

var _Constants = require('../common/Constants');

var _Constants2 = _interopRequireDefault(_Constants);

var _Game = require('../game/Game');

var _Game2 = _interopRequireDefault(_Game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChatHandler = function () {
  function ChatHandler(nsp, roomId, socket) {
    _classCallCheck(this, ChatHandler);

    this.roomId = roomId;
    this._namespace = nsp;
    this._socket = socket;
    // this.createRoomCallback = cCallback;
    // this.joinedRoomCallback = jCallback;

    this.initSocket(this._socket);
  }

  _createClass(ChatHandler, [{
    key: 'initSocket',
    value: function initSocket(socket) {
      console.log('@@##initSocket @@:' + socket.handshake.query.token + ' ' + socket.handshake.query.name);
      // this._user = new User(socket.id, socket.handshake.query.name);
      this._socket.on('message', this.receiveMessage.bind(this));
      // socket.on('disconnect', this.onDisConnect.bind(this));
      // socket.on('userChat', this.onUserChatMessage.bind(this));
      // socket.on('createRoom', this.onCreateRoom.bind(this));
      // socket.on('joinRoom', this.onJoinRoom.bind(this));
      // socket.on(Constants.GET_ROOMS, this.onGetRooms.bind(this));

      // socket.on('pointData', this.onGetPointData.bind(this));

      // socket.on('gameEvent', this.onGameEvent.bind(this));
      // socket.on('connection', this.onConnect.bind(this));
    }
  }, {
    key: 'onConnect',
    value: function onConnect(sockect) {
      console.log('@@##onConnect:' + _typeof(this.rooms[0]));
    }

    // onGetRooms (data, fn) {
    // fn && fn(this._rooms);
    // }

  }, {
    key: 'receiveMessage',
    value: function receiveMessage(message) {
      console.log('chat receive message:' + message);
      // 然后呢 =
    }
  }, {
    key: 'onUserChatMessage',
    value: function onUserChatMessage(message) {
      console.log('onUserChatMessage:' + message);
      if (this.roomId) {
        this._namespace.to(this.roomId).emit('serverSendUserChat', {
          nick: this._user.nickName,
          message: message
        });
      } else {
        this._namespace.emit('serverSendUserChat', {
          nick: this._user.nickName,
          message: message
        });
      }

      // let curRoom = this._rooms[this._user.roomId];
      // if (curRoom) {
      //     let users = curRoom.users;
      //     for (let user of users) {
      //         this._namespace.to(user.id).emit('serverSendUserChat', {
      //             nick: user.nickName,
      //             message: message + 'from' + user.nickName
      //         });
      //     }
      // }
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(socketId, event, message) {
      //发消息到房间还是给人
      this._socket.broadcast.to(socketId).emit(event, message);
    }
  }, {
    key: 'sendMessageToRoom',
    value: function sendMessageToRoom(room, event, message) {
      //发消息到房间还是给人呢
      this._namespace.to(room).emit(event, message);
    }
  }, {
    key: 'onDisConnect',
    value: function onDisConnect() {
      console.log('User ' + this._user.nickName + ' disconneted');
    }
  }]);

  return ChatHandler;
}();

exports.default = ChatHandler;
//# sourceMappingURL=ChatHandler.js.map