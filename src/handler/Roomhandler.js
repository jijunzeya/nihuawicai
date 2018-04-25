import User from '../beans/User';
import Room from '../beans/Room';
import Constants from '../common/Constants';
import Game from '../game/Game';
export default class RoomHandler {

  _socket;

  _user;

  _namespace;

  createRoomCallback;

  joinedRoomCallback;

  // _rooms;

  constructor(nsp, socket, cCallback, jCallback) {
    this._namespace = nsp;
    // this._rooms = rooms;
    this._socket = socket;
    this.createRoomCallback = cCallback;
    this.joinedRoomCallback = jCallback;

    this.initSocket(this._socket);
  }

  initSocket (socket) {
    console.log('@@##initSocket @@:' + socket.handshake.query.token + ' ' + socket.handshake.query.name)
    this._user = new User(socket.id, socket.handshake.query.name);
    this._socket.on('message', this.receiveMessage.bind(this));
    // socket.on('disconnect', this.onDisConnect.bind(this));
    socket.on('userChat', this.onUserChatMessage.bind(this));

    // socket.on('createRoom', this.onCreateRoom.bind(this));
    // socket.on('joinRoom', this.onJoinRoom.bind(this));
    socket.on(Constants.GET_ROOMS, this.onGetRooms.bind(this));

    socket.on('pointData', this.onGetPointData.bind(this));
    socket.on('gameEvent', this.onGameEvent.bind(this));

    socket.on('connection', this.onConnect.bind(this));
  }

  onConnect (sockect) {
    console.log('@@##onConnect:' + (typeof this.rooms[0]));
  }

  onGetRooms (data, fn) {
    fn && fn(this._rooms);
  }

  receiveMessage (message) {
    console.log('chat receive message:' + message);
    // 然后呢 =
  }



  // 接收游戏数据
  onGetPointData (point) {
    if (!this.game) {
      this.game = new Game(this._rooms[this._user.roomId], (event) => {
        // this._namespace.to(this._user.roomId).emit('gamePointData', p);
        this.sendMessageToRoom(this._user.roomId, event.name, event.data);
      });
    }
    this.game.handleData(point);

  }

  onGameEvent (event) {
    if (event && event.action) {
      this.game && this.game.handleGameEvent(event);
    }
  }

  onUserChatMessage (message) {
    console.log('onUserChatMessage:' + message);
    this._namespace.to(this._user.roomId).emit('serverSendUserChat', {
      nick: this._user.nickName,
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

  sendMessage (socketId, event, message) {
    //发消息到房间还是给人
    _socket.broadcast.to(socketId).emit(event, message);
  }

  sendMessageToRoom (room, event, message) {
    //发消息到房间还是给人呢
    this._namespace.to(room).emit(event, message);
  }

  onDisConnect () {
    console.log('User ' + this._user.nickName + ' disconneted');
  }

}