'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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
    function ChatHandler(nsp, rooms, socket, cCallback, jCallback) {
        _classCallCheck(this, ChatHandler);

        this._namespace = nsp;
        this._rooms = rooms;
        this._socket = socket;
        this.createRoomCallback = cCallback;
        this.joinedRoomCallback = jCallback;

        this.initSocket(this._socket);
    }

    _createClass(ChatHandler, [{
        key: 'initSocket',
        value: function initSocket(socket) {
            console.log('@@##initSocket @@:' + this._socket.handshake.query.name);
            this._user = new _User2.default(socket.id, socket.handshake.query.name);
            this._socket.on('message', this.receiveMessage.bind(this));
            // socket.on('disconnect', this.onDisConnect.bind(this));
            socket.on('userChat', this.onUserChatMessage.bind(this));
            socket.on('createRoom', this.onCreateRoom.bind(this));
            socket.on('joinRoom', this.onJoinRoom.bind(this));
            socket.on(_Constants2.default.GET_ROOMS, this.onGetRooms.bind(this));

            socket.on('pointData', this.onGetPointData.bind(this));

            socket.on('gameEvent', this.onGameEvent.bind(this));
        }
    }, {
        key: 'onCreateRoom',
        value: function onCreateRoom(data, fn) {
            var _this = this;

            console.log('[CHAT]create room :' + ' ' + JSON.stringify(data));
            // 如果房间存在，则转去加入
            if (this._rooms[data.roomId]) {
                this.onJoinRoom(data, fn);
                return;
            }
            // 校验
            //roomName:房间名称 id 房间roomId
            this._socket.join(data.roomId, function () {

                var room = new _Room2.default(data.roomId);
                _this._user.roomId = data.roomId;
                _this._user.nickName = data.name;
                room.join(_this._user);
                try {
                    _this._rooms[data.roomId] = room;
                    console.log('@@##this._rooms:' + JSON.stringify(_this._rooms));
                    if (!_this.game) {
                        _this.game = new _Game2.default(_this._rooms[_this._user.roomId], function (event) {
                            console.log('@@##onGetPointData:' + JSON.stringify(event));
                            // this._namespace.to(this._user.roomId).emit('gamePointData', p);
                            _this.sendMessageToRoom(_this._user.roomId, event.name, event.data);
                        });
                    }
                } catch (err) {
                    console.log('@@##error is ' + err);
                }

                // Object.assign(this._rooms, { 'fff': room })
                // console.log('@@##this._rooms 2:' + JSON.stringify(this._rooms))

                _this.createRoomCallback(data.roomId);
                _this._socket.emit('joinedRoom', { code: 0, roomId: data.roomId });
                // 返回房间数
                _this._namespace.emit(_Constants2.default.GET_ROOMS, _this._rooms);

                fn && fn(data.roomId);
            });
        }
    }, {
        key: 'onJoinRoom',
        value: function onJoinRoom(data, fn) {
            var _this2 = this;

            console.log('@@##joinRoom:' + JSON.stringify(data));
            console.log('@@##joinRoom this._rooms :' + JSON.stringify(this._rooms));
            var curRoom = this._rooms[data.roomId];
            if (!curRoom) {
                console.log('@@##joinRoom fail!' + data);
                this._socket.emit('joinedRoom', { result: '不存在房间号:' + data.roomId, code: -1 });
                return;
            } else {
                if (curRoom.users.length >= 4) {
                    this._socket.emit('joinedRoom', { result: '已满座', code: -1 });
                    return;
                }
            }

            // 如果当前用户的ROOMID与传入的一致，说明已在房间了
            if (this._user.roomId == data.roomId) {
                console.log('USER IS ALREADY IN ROOM!');
            } else {
                if (this._user.roomId) {
                    //如果不一样，则先将之前的退出，删掉，再进入新的
                    this._socket.leave(this._user.roomId, function () {
                        console.log('@@##' + _this2._user.nickName + ' leave ' + _this2._user.roomId);
                    });
                }

                this._socket.join(data.roomId, function () {
                    console.log('join rooms:' + JSON.stringify(curRoom.id) + ' ' + JSON.stringify(_this2._rooms));
                    _this2._user.roomId = data.roomId;
                    _this2._user.nickName = data.name;
                    curRoom.join(_this2._user);
                    //   console.log('@@##joined room info :' + JSON.stringify(curRoom.users));
                    _this2._namespace.to(curRoom.id).emit('serverSendUserChat', {
                        nick: _this2._user.nickName,
                        message: '我在' + data.roomId
                    });
                    _this2.joinedRoomCallback(data.roomId);
                    _this2._socket.emit('joinedRoom', { code: 0, roomId: data.roomId });
                    // 返回房间数
                    // 测试发给所有
                    _this2._namespace.emit(_Constants2.default.GET_ROOMS, _this2._rooms);

                    fn && fn(data.roomId);
                });
            }
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
            var _this3 = this;

            if (!this.game) {
                this.game = new _Game2.default(this._rooms[this._user.roomId], function (event) {
                    // this._namespace.to(this._user.roomId).emit('gamePointData', p);
                    _this3.sendMessageToRoom(_this3._user.roomId, event.name, event.data);
                });
            }
            this.game.handleData(point);
        }
    }, {
        key: 'onGameEvent',
        value: function onGameEvent(event) {
            if (event && event.action) {
                this.game && this.game.handleGameEvent(event);
            }
        }
    }, {
        key: 'onUserChatMessage',
        value: function onUserChatMessage(message) {
            console.log('onUserChatMessage:' + message);
            this._namespace.to(this._user.roomId).emit('serverSendUserChat', {
                nick: this._user.nickName,
                message: message + ' from 房间' + this._user.roomId
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
            console.log('User ' + this._user.nickName + ' disconneted');
        }
    }]);

    return ChatHandler;
}();

exports.default = ChatHandler;
//# sourceMappingURL=ChatHandler.js.map