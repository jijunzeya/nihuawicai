import User from '../beans/User';
import Room from '../beans/Room';
import Constants from '../common/Constants';
import Game from '../game/Game';
export default class ChatHandler {

  _socket;

  _user;

  _namespace;

  createRoomCallback;

  joinedRoomCallback;

  _rooms;

  constructor(nsp, rooms, socket, cCallback, jCallback) {
    this._namespace = nsp;
    this._rooms = rooms;
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
    socket.on('createRoom', this.onCreateRoom.bind(this));
    socket.on('joinRoom', this.onJoinRoom.bind(this));
    socket.on(Constants.GET_ROOMS, this.onGetRooms.bind(this));

    socket.on('pointData', this.onGetPointData.bind(this));

    socket.on('gameEvent', this.onGameEvent.bind(this));
    socket.on('connection', this.onConnect.bind(this));
  }

  onConnect (sockect) {
    console.log('@@##onConnect:' + (typeof this.rooms[0]));
  }

  onCreateRoom (data, fn) {
    if (!data || !data.name || !data.roomId) {

      return;
    }
    console.log('[CHAT]create room :' + ' ' + JSON.stringify(data));
    // 如果房间存在，则转去加入
    if (this._rooms[data.roomId]) {
      this.onJoinRoom(data, fn);
      return;
    }
    // 校验
    //roomName:房间名称 id 房间roomId
    this._socket.join(data.roomId, () => {
      const room = new Room(data.roomId);
      this._user.roomId = data.roomId;
      this._user.nickName = data.name;
      room.join(this._user);
      try {
        this._rooms[data.roomId] = room;
        console.log('@@##this._rooms:' + JSON.stringify(this._rooms))
        if (!this.game) {
          this.game = new Game(this._rooms[this._user.roomId], (event) => {
            console.log('@@##onGetPointData:' + JSON.stringify(event));
            // this._namespace.to(this._user.roomId).emit('gamePointData', p);
            this.sendMessageToRoom(this._user.roomId, event.name, event.data);
          });
        }
      } catch (err) {
        console.log('@@##error is ' + err);
      }

      // Object.assign(this._rooms, { 'fff': room })
      // console.log('@@##this._rooms 2:' + JSON.stringify(this._rooms))

      this.createRoomCallback(data.roomId);
      this._socket.emit('joinedRoom', { code: 0, roomId: data.roomId });
      // 返回房间数
      this._namespace.emit(Constants.GET_ROOMS, this._rooms);

      fn && fn(data.roomId);
    });
  }

  onJoinRoom (data, fn) {
    console.log('@@##joinRoom:' + JSON.stringify(data));
    console.log('@@##joinRoom this._rooms :' + JSON.stringify(this._rooms))
    let curRoom = this._rooms[data.roomId];
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
      console.log('USER IS ALREADY IN ROOM!')
    } else {
      if (this._user.roomId) {
        //如果不一样，则先将之前的退出，删掉，再进入新的
        this._socket.leave(this._user.roomId, () => {
          console.log('@@##' + this._user.nickName + ' leave ' + this._user.roomId);
        })
      }

      this._socket.join(data.roomId, () => {
        console.log('join rooms:' + JSON.stringify(curRoom.id) + ' ' + JSON.stringify(this._rooms));
        this._user.roomId = data.roomId;
        this._user.nickName = data.name;
        curRoom.join(this._user);
        //   console.log('@@##joined room info :' + JSON.stringify(curRoom.users));
        this._namespace.to(curRoom.id).emit('serverSendUserChat', {
          nick: this._user.nickName,
          message: '我在' + data.roomId
        });
        this.joinedRoomCallback(data.roomId);
        this._socket.emit('joinedRoom', { code: 0, roomId: data.roomId });
        // 返回房间数
        // 测试发给所有
        this._namespace.emit(Constants.GET_ROOMS, this._rooms);

        fn && fn(data.roomId);
      });
    }

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