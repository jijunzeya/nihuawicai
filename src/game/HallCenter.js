let Room = require('../beans/Room');
let User = require('../beans/User');
let SocketHandler = require('../handler/SocketHandler');

let RoomCenter = require('./RoomCenter');

class Hall {
  // 大厅只有一个
  id;
  roomCenters = {};

  socketHandler;

  user;
  users = [];

  constructor(server) {
    socketHandler = new SocketHandler(server, this.onConnection);
  }

  onConnection (data) {

    console.log('@@##nsp connection :' + socket.id);

    this.initListeners();

    // let roomId = socket.handshake.query.roomId;
    // let token = sockect.handshake.query.token;
    let roomId = data.roomId;
    let token = data.token;
    let name = data.name;
    // 暂时先用id + name约束
    this.user = new User(socket.id, name);
    this.users.push(this.user);
    if (roomId) {
      // 如果存在,则重进
      if (this.roomCenters[roomId]) {
        this.socketHandler.joinRoom(roomId, () => {
          let roomCenter = this.roomCenters[roomId];
          roomCenter.joinUser(this.user);
        })
      } else {
        this.socketHandler.joinRoom(roomId, () => {
          let room = new Room(roomId);
          let newRoom = new RoomCenter(room);
          newRoom.joinUser(this.user);
          this.roomCenters[roomId] = newRoom;
        })
      }
      // 直接通去房间
    } else {
      // 在大厅
    }

    socket.on('disconnect', () => {
      console.log('@@##socket disconnect:' + socket.id);
      delete this.chatHandlers[socket.id];
      // console.log('@@##disconnect:' + JSON.stringify(this.chatHandlers));
    })

  }

  initListeners () {
    this.socketHandler.initListeners({
      'createRoom': this.onCreateRoom
    })
  }

  onCreateRoom (data, fn) {
    if (!data || !data.name || !data.roomId) {

      return;
    }
    console.log('[CHAT]create room :' + ' ' + JSON.stringify(data));
    // 如果房间存在，则转去加入
    if (this.roomCenters[data.roomId]) {
      this.onJoinRoom(data, fn);
      return;
    }
    // 校验
    //roomName:房间名称 id 房间roomId
    this.socketHandler.joinRoom(data.roomId, () => {

      let room = new Room(roomId);
      let newRoom = new RoomCenter(room);
      newRoom.joinUser(this.user);
      this.roomCenters[roomId] = newRoom;

      // try {
      //   console.log('@@##this._rooms:' + JSON.stringify(this._rooms))
      //   if (!this.game) {
      //     this.game = new Game(this._rooms[this._user.roomId], (event) => {
      //       console.log('@@##onGetPointData:' + JSON.stringify(event));
      //       // this._namespace.to(this._user.roomId).emit('gamePointData', p);
      //       this.sendMessageToRoom(this._user.roomId, event.name, event.data);
      //     });
      //   }
      // } catch (err) {
      //   console.log('@@##error is ' + err);
      // }

      // Object.assign(this._rooms, { 'fff': room })
      // console.log('@@##this._rooms 2:' + JSON.stringify(this._rooms))

      // this.createRoomCallback(data.roomId);
      // this._socket.emit('joinedRoom', { code: 0, roomId: data.roomId });
      // 返回房间数
      // this._namespace.emit(Constants.GET_ROOMS, this._rooms);

      this.socketHandler.sendMessage('joinedRoom', { code: 0, roomId: data.roomId })
      this.socketHandler.getNsp().emit(Constants.GET_ROOMS, this._rooms);

      fn && fn(data.roomId);
    });
  }

  onJoinRoom (data, fn) {
    console.log('@@##joinRoom:' + JSON.stringify(data));
    let curRoom = this.roomCenters[data.roomId];
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
    if (this.user.roomId == data.roomId) {
      console.log('USER IS ALREADY IN ROOM!')
      // 返回到房间页
    } else {
      if (this.user.roomId) {
        //如果不一样，则先将之前的退出，删掉，再进入新的
        this.socket.leave(this.user.roomId, () => {
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

  // 加入 
  joinRoom (room) {

    if (room && room.id) {
      this.rooms[room.id] = room;
    }

  }

  // 解散
  dissolveRoom (room) {
    if (room && room.id) {
      delete this.rooms[room.id]
    }

  }

}

module.exports = Hall;