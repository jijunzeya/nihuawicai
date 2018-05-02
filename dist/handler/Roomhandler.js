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

var RoomHandler = function () {

  // createRoomCallback;

  // joinedRoomCallback;

  function RoomHandler(id, nsp, socket, handleGameData, handleGameEvent) {
    _classCallCheck(this, RoomHandler);

    this.roomId = id;
    this._namespace = nsp;
    // this._rooms = rooms;
    this._socket = socket;
    // this.createRoomCallback = cCallback;
    // this.joinedRoomCallback = jCallback;
    this.handleGameEvent = handleGameEvent;
    this.handleGameData = handleGameData;

    this.initSocket(this._socket);
  }

  // _rooms;


  // _user;

  _createClass(RoomHandler, [{
    key: 'resetSocket',
    value: function resetSocket(id, socket) {
      this.roomId = id;
      this._socket = socket;
      this.initSocket(socket);
    }
  }, {
    key: 'initSocket',
    value: function initSocket(socket) {
      console.log('@@##initSocket @@:' + socket.handshake.query.token + ' ' + socket.handshake.query.name);
      // this._user = new User(socket.id, socket.handshake.query.name);
      this._socket.on('message', this.receiveMessage.bind(this));
      // socket.on('disconnect', this.onDisConnect.bind(this));
      socket.on('userChat', this.onUserChatMessage.bind(this));

      // socket.on('createRoom', this.onCreateRoom.bind(this));
      // socket.on('joinRoom', this.onJoinRoom.bind(this));
      socket.on(_Constants2.default.GET_ROOMS, this.onGetRooms.bind(this));

      socket.on('pointData', this.onGetPointData.bind(this));
      socket.on('gameEvent', this.onGameEvent.bind(this));

      socket.on('connection', this.onConnect.bind(this));
    }

    // handleGame(game)

  }, {
    key: 'onConnect',
    value: function onConnect(sockect) {
      console.log('@@##onConnect:' + _typeof(this.rooms[0]));
    }
  }, {
    key: 'onGetRooms',
    value: function onGetRooms(data, fn) {
      fn && fn(this._rooms);
    }
  }, {
    key: 'receiveMessage',
    value: function receiveMessage(message) {
      console.log('chat receive message:' + message);
      // 然后呢 =
    }

    // 接收游戏数据

  }, {
    key: 'onGetPointData',
    value: function onGetPointData(point) {
      // if (!this.game) {
      //   this.game = new Game((event) => {
      //     // this._namespace.to(this._user.roomId).emit('gamePointData', p);
      //     this.sendMessageToRoom(this.roomId, event.name, event.data);
      //   });
      // }
      // this.game.handleData(point);
      console.log('@@##onGetPointData:' + this._socket.id + ' ' + JSON.stringify(point));
      this.handleGameData(point);
    }
  }, {
    key: 'onGameEvent',
    value: function onGameEvent(event) {
      if (event && event.action) {
        // this.game && this.game.handleGameEvent(event);
        this.handleGameEvent && this.handleGameEvent(point);
      }
    }
  }, {
    key: 'onUserChatMessage',
    value: function onUserChatMessage(message) {
      console.log('onUserChatMessage:' + message);
      this._namespace.to(this.roomId).emit('serverSendUserChat', {
        nick: this._socket.id,
        message: message
      });

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
      _socket.broadcast.to(socketId).emit(event, message);
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
      console.log('User ' + this._sockect.id + ' disconneted');
    }
  }]);

  return RoomHandler;
}();

exports.default = RoomHandler;
//# sourceMappingURL=Roomhandler.js.map