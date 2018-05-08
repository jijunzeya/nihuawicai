import ChatHandler from '../handler/ChatHandler';

import Room from '../beans/Room';
import User from '../beans/User';
import SocketHandler from '../handler/SocketHandler';
// import default from '../beans/Point';
import Constants from '../common/Constants';
import RoomCenter from './RoomCenter';

export default class Hall {
  // 大厅只有一个
  id;
  roomCenters = {};

  socketHandler;

  user;
  users = [];

  constructor(server) {
    this.socketHandler = new SocketHandler(server, this.onConnection.bind(this));
    this.initListeners.bind(this);
    this.onCreateRoom.bind(this);
    this.getRooms.bind(this);
  }

  onConnection (data) {
    // let roomId = socket.handshake.query.roomId;
    // let token = sockect.handshake.query.token;
    let roomId = data.roomId;
    let token = data.token;
    let name = data.name;
    let socketId = data.socketId;

    let socket = this.socketHandler.getSocket(socketId);
    // console.log('@@##nsp connection :' + socket.id);

    this.initListeners(socketId);
    // 暂时先用id + name约束
    this.user = new User(socket.id, name);
    // this.user.socket = socket;
    this.users.push(this.user);
    if (roomId) {
      // 如果存在,则重进
      if (this.roomCenters[roomId]) {
        this.socketHandler.joinRoom(socketId, roomId, () => {
          let roomCenter = this.roomCenters[roomId];
          roomCenter.joinUser(this.user);
        })
      } else {
        this.socketHandler.joinRoom(socketId, roomId, () => {
          let room = new Room(roomId);
          let newRoom = new RoomCenter(room, this.socketHandler.getNsp(), this.socketHandler.getSocket(socketId));
          newRoom.joinUser(this.user);
          this.roomCenters[roomId] = newRoom;
        })
      }
      // 直接通去房间
    } else {
      // 在大厅
    }

    // new ChatHandler(this.socketHandler.getNsp(), roomId, this.socketHandler.getSocket(socketId));

    socket.on('disconnect', () => {
      console.log('@@##socket disconnect:' + socket.id);
      if (this.roomCenters[roomId])
        this.roomCenters[roomId].leaveRoom(this.user);
      // console.log('@@##disconnect:' + JSON.stringify(this.chatHandlers));
    })

  }

  initListeners (socketId) {
    let initListeners = {
      'createRoom': this.onCreateRoom.bind(this)
    };

    initListeners[Constants.GET_ROOMS] = this.onGetRooms.bind(this);

    this.socketHandler.initListeners(socketId, initListeners);
  }

  onGetRooms (data, fn) {
    console.log('@@##HallCenter onGetRooms:');
    let rooms = this.getRooms();
    // for (let roomCenter in this.roomCenters) {
    //   rooms[roomCenter] = this.roomCenters[roomCenter].room;
    // }
    // console.log('@@##HallCenter rooms:' + JSON.stringify(rooms));
    this.socketHandler.getNsp().emit(Constants.GET_ROOMS, rooms);
    fn && fn(rooms);
  }

  onCreateRoom (data, fn, socketId) {
    if (!data || !data.name || !data.roomId) {
      return;
    }
    console.log('[CHAT]create room :' + ' ' + JSON.stringify(data));
    // 如果房间存在，则转去加入
    if (this.roomCenters[data.roomId]) {
      this.onJoinRoom(data, fn, socketId);
      return;
    }
    // 校验
    //roomName:房间名称 id 房间roomId
    this.socketHandler.joinRoom(socketId, data.roomId, () => {

      let room = new Room(data.roomId);
      let newRoom = new RoomCenter(room, this.socketHandler.getNsp(), this.socketHandler.getSocket(socketId));
      newRoom.joinUser(this.user);
      this.roomCenters[data.roomId] = newRoom;

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

      this.socketHandler.sendMessage(socketId, 'joinedRoom', { code: 0, roomId: data.roomId })
      let rooms = this.getRooms();

      console.log('@@##HallCenter rooms:' + JSON.stringify(rooms));
      this.socketHandler.getNsp().emit(Constants.GET_ROOMS, rooms);

      fn && fn(data.roomId);
    });
  }

  onJoinRoom (data, fn, socketId) {
    console.log('@@##joinRoom:' + JSON.stringify(data));
    let curRoom = this.roomCenters[data.roomId];
    if (!curRoom) {
      console.log('@@##joinRoom fail!' + data);
      this.socketHandler.sendMessage(socketId, 'joinedRoom', { result: '不存在房间号:' + data.roomId, code: -1 });
      return;
    } else {
      if (curRoom.room.users.length >= 4) {
        this.socketHandler.sendMessage(socketId, 'joinedRoom', { result: '已满座', code: -1 });
        return;
      }
    }

    // 如果当前用户的ROOMID与传入的一致，说明已在房间了
    if (this.user.roomId && this.user.roomId == data.roomId) {
      console.log('USER IS ALREADY IN ROOM!')

      fn && fn(data.roomId);
      // 返回到房间页
    } else {
      if (data.roomId) {

        this.socketHandler.getSocket(socketId).join(data.roomId, () => {
          console.log('join rooms:' + JSON.stringify(curRoom.id));
          curRoom.joinUser(this.user);
          //   console.log('@@##joined room info :' + JSON.stringify(curRoom.users));
          this.socketHandler.getNsp().to(curRoom.id).emit('serverSendUserChat', {
            nick: this.user.nickName,
            message: '我在' + data.roomId
          });


          // this.joinedRoomCallback(data.roomId);
          // this._socket.emit('joinedRoom', { code: 0, roomId: data.roomId });
          // // 返回房间数
          // // 测试发给所有
          // this._namespace.emit(Constants.GET_ROOMS, this._rooms);

          this.socketHandler.sendMessage(socketId, 'joinedRoom', { code: 0, roomId: data.roomId })
          let rooms = this.getRooms();
          console.log('@@##HallCenter rooms:' + JSON.stringify(rooms));
          this.socketHandler.getNsp().emit(Constants.GET_ROOMS, rooms);

          fn && fn(data.roomId);
        });

        //如果不一样，则先将之前的退出，删掉，再进入新的
        // this.socketHandler.getSocket(socketId).leave(this.user.roomId, () => {
        //   console.log('@@##' + this.user.nickName + ' leave ' + this.user.roomId);
        //   this.roomCenters[this.user.roomId].leaveRoom(this.user);

        // this.socketHandler.getSocket(socketId).join(data.roomId, () => {
        //   console.log('join rooms:' + JSON.stringify(curRoom.id));
        //   curRoom.joinUser(this.user);
        //   //   console.log('@@##joined room info :' + JSON.stringify(curRoom.users));
        //   this.socketHandler.getNsp().to(curRoom.id).emit('serverSendUserChat', {
        //     nick: this.user.nickName,
        //     message: '我在' + data.roomId
        //   });


        //   // this.joinedRoomCallback(data.roomId);
        //   // this._socket.emit('joinedRoom', { code: 0, roomId: data.roomId });
        //   // // 返回房间数
        //   // // 测试发给所有
        //   // this._namespace.emit(Constants.GET_ROOMS, this._rooms);

        //   this.socketHandler.sendMessage(socketId, 'joinedRoom', { code: 0, roomId: data.roomId })
        //   let rooms = this.getRooms();
        //   console.log('@@##HallCenter rooms:' + JSON.stringify(rooms));
        //   this.socketHandler.getNsp().emit(Constants.GET_ROOMS, rooms);

        //   fn && fn(data.roomId);
        // });
        // })
      }


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

  getRooms () {
    let rooms = {};
    for (let roomCenter in this.roomCenters) {
      let room = this.roomCenters[roomCenter].room;
      rooms[roomCenter] = {
        id: room.id,
        roomName: room.roomName
      };
      rooms[roomCenter].users = []
      for (let nickName in room.users) {
        let user = room.users[nickName];
        rooms[roomCenter].users.push({
          id: user.id,
          nickName: user.nickName
        })

      }
    }
    return rooms;
  }

}
