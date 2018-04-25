import Room from '../beans/Room';
import RoomHandler from '../handler/RoomHandler';
import Game from './Game';

export default class RoomCenter {
  id;
  room = null;
  roomHandler = null;
  game = null;
  constructor(room, nsp, socket) {
    this.room = room;
    this.id = room.id;

    this.roomHandler = new RoomHandler(this.id, nsp, socket, (roomId) => {
      //创建room成功
      console.log('@@##创建房间成功:' + roomId);
    }, (roomId) => {
      // 加入room成功
      console.log('@@##加入房间成功:' + roomId);
    });

    this.initGame();
    // // this.chatHandlers[socket.id] = chatHandler;
    // console.log('@@##connection:' + chatHandler._user.nickName);
    // console.log('@@##connection:' + this.chatHandlers.keys());
  }

  joinUser (user) {
    user.roomId = this.id;
    this.room.join(user);
  }

  leaveRoom (user) {
    user.roomId = null;
    this.room.leave(user);
  }

  initGame () {
    this.game = new Game(event => {
      this.roomHandler.sendMessageToRoom(this.room.id, event.name, event.data);
    });
  }



}
