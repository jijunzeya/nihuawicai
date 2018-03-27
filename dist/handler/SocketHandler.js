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
    function SocketHandler(server) {
        var _this = this;

        _classCallCheck(this, SocketHandler);

        this.rooms = {};
        this.chatHandlers = {};

        var io = new _socket2.default(server);
        var nsp = io.of('/chat');

        // let nsp =io;
        nsp.on('connection', function (socket) {
            console.log('@@##nsp connection :' + socket.id);
            var chatHandler = new _ChatHandler2.default(nsp, _this.rooms, socket, function (roomId) {
                //创建room成功
                console.log('@@##创建房间成功:' + roomId);
            }, function (roomId) {
                // 加入room成功
                console.log('@@##加入房间成功:' + roomId);
            });
            _this.chatHandlers[socket.id] = chatHandler;
            console.log('@@##connection:' + chatHandler._user.nickName);
            // console.log('@@##connection:' + this.chatHandlers.keys());
            socket.on('disconnect', function () {
                console.log('@@##socket disconnect:' + socket.id);
                delete _this.chatHandlers[socket.id];
                // console.log('@@##disconnect:' + JSON.stringify(this.chatHandlers));
            });
        });
    }

    _createClass(SocketHandler, [{
        key: 'init',
        value: function init(func) {}
    }]);

    return SocketHandler;
}();

exports.default = SocketHandler;
//# sourceMappingURL=SocketHandler.js.map