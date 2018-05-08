import User from '../beans/User';
import Room from '../beans/Room';
import Constants from '../common/Constants';
import Game from '../game/Game';
export default class RoomHandler {

  _socket;

  // _user;

  _namespace;

  // createRoomCallback;

  // joinedRoomCallback;

  handleGameEvent;

  // _rooms;
  roomId;

  constructor(id, nsp, socket, handleGameData, handleGameEvent) {
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

  removeAllListener () {
    console.log(`@@##removeAllListeners ${this._socket.id}`);
    this._socket.removeAllListeners(['message', 'userChat', 'pointData', 'gameEvent']);
  }

  resetSocket (id, socket) {
    this.roomId = id;
    this._socket = socket;
    this.initSocket(socket);
  }

  initSocket (socket) {
    console.log('@@##initSocket @@:' + socket.handshake.query.token + ' ' + socket.handshake.query.name)
    // this._user = new User(socket.id, socket.handshake.query.name);
    this._socket.on('message', this.receiveMessage.bind(this));
    // socket.on('disconnect', this.onDisConnect.bind(this));
    socket.on('userChat', this.onUserChatMessage.bind(this));

    // socket.on('createRoom', this.onCreateRoom.bind(this));
    // socket.on('joinRoom', this.onJoinRoom.bind(this));
    socket.on(Constants.GET_ROOMS, this.onGetRooms.bind(this));

    socket.on('pointData', this.onGetPointData.bind(this));
    socket.on('gameEvent', this.onGameEvent.bind(this));
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

  onGameEvent (event) {
    if (event && event.action) {
      // this.game && this.game.handleGameEvent(event);
      this.handleGameEvent && this.handleGameEvent(point);
    }
  }

  onUserChatMessage (message) {
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

  sendMessage (socketId, event, message) {
    //发消息到房间还是给人
    _socket.broadcast.to(socketId).emit(event, message);
  }

  sendMessageToRoom (room, event, message) {
    //发消息到房间还是给人呢
    this._namespace.to(room).emit(event, message);
  }

  disConnect () {
    console.log('User ' + this._sockect.id + ' disconneted');
    // this._socket.disConnect();
  }

}