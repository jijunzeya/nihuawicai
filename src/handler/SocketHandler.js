
import SocketIO from 'socket.io';

// import User from './beans/User';
// import Room from './beans/Room';
import ChatHandler from './ChatHandler';
export default class SocketHandler {
  rooms = {};
  chatHandlers = {};

  nsp;
  socket;

  constructor(server, onConnection) {
    let io = new SocketIO(server);
    this.nsp = io.of('/chat');

    // middleware
    // nsp.use((socket, next) => {
    //   let token = socket.handshake.query.token;
    //   console.log('@@##nsp middleware:' + token);
    //   return next();
    //   // if (isValid(token)) {
    //   //   return next();
    //   // }
    //   // return next(new Error('authentication error'));
    // });

    // let nsp =io;
    this.nsp.on('connection', socket => {
      this.socket = socket;
      // let roomId = socket.handshake.query.roomId;
      // let token = sockect.handshake.query.token;
      let data = {
        roomId: socket.handshake.query.roomId,
        token: socket.handshake.query.token,
        name: socket.handshake.query.name
      }
      onConnection(data);
    });
  }

  initListeners (listeners) {
    for (let key in listeners) {
      this.socket.on(key, listeners[key]);
    }
  }

  joinRoom (roomId, callback) {
    if (this.socket) {
      this.socket.join(roomId, callback);
    } else {
      throw new Error('socket is not initial');
    }
  }

  //改变房间
  chanageRoom (oldRoomId, newRoomId, callback) {

  }

  getNsp () {
    return this.nsp;
  }

  getSocket () {
    return this.socket;
  }

  sendMessageToRoom (room, event, message) {
    //发消息到房间还是给人呢
    this.nsp.to(room).emit(event, message);
  }

  sendMessage (event, message) {
    this.socket.emit(event, message);
  }

  init (func) {

  }

}