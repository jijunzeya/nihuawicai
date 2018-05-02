import Room from '../beans/Room';
import RoomHandler from '../handler/RoomHandler';
import Game from './Game';

export default class RoomCenter {
  id;
  room = null;
  roomHandler = null;
  game = null;
  constructor(room, nsp, socket) {
    this.nsp = nsp;
    this.room = room;
    this.id = room.id;

    // this.roomHandler = new RoomHandler(this.id, nsp, socket, (roomId) => {
    //   //创建room成功
    //   console.log('@@##创建房间成功:' + roomId);
    // }, (roomId) => {
    //   // 加入room成功
    //   console.log('@@##加入房间成功:' + roomId);
    // });

    this.initGame();
    // // this.chatHandlers[socket.id] = chatHandler;
    // console.log('@@##connection:' + chatHandler._user.nickName);
    // console.log('@@##connection:' + this.chatHandlers.keys());
    this.handleData.bind(this);
    this.handleGameEvent.bind(this);
  }

  handleData (data) {
    console.log('@@##游戏数据:' + JSON.stringify(data));
    this.game.handleData(data);
  }

  handleGameEvent (event) {
    console.log('@@##房间事件:' + JSON.stringify(event));
    this.game.handleGameEvent(event);
  }


  joinUser (user) {
    if (user.roomId == this.id) {
      return;
    }
    user.roomId = this.id;
    if (!user.roomHandler) {
      user.roomHandler = new RoomHandler(this.id, this.nsp, this.nsp.sockets[user.id], data => {
        console.log('@@##游戏数据:' + JSON.stringify(data));
        this.game.handleData(data);
      }, event => {
        console.log('@@##房间事件:' + JSON.stringify(event));
        this.game.handleGameEvent(event);
      });
    } else {
      user.roomHandler.resetSocket(this.id, this.nsp.sockets[user.id])
    }

    this.room.join(user);
  }

  leaveRoom (user) {
    // user.roomId = null;
    this.room.leave(user);
  }

  initGame () {
    this.game = new Game(event => {
      // this.roomHandler.sendMessageToRoom(this.room.id, event.name, event.data);
      console.log('@@##initGame:' + JSON.stringify(event));
      this.nsp.to(this.room.id).emit(event.name, event.data);
    });
  }



}
