
import SocketIO from 'socket.io';

// import User from './beans/User';
// import Room from './beans/Room';
import ChatHandler from './ChatHandler';
export default class SocketHandler {
  rooms = {};
  chatHandlers = {};

  nsp;
  // sockets = {};

  constructor(server, onConnection) {
    let io = new SocketIO(server);
    this.nsp = io.of('/chat');
    this.nsp.sockets = {};
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

      this.nsp.sockets[socket.id] = socket;

      // let roomId = socket.handshake.query.roomId;
      // let token = sockect.handshake.query.token;
      let data = {
        socketId: socket.id,
        roomId: socket.handshake.query.roomId,
        token: socket.handshake.query.token,
        name: socket.handshake.query.name
      }
      onConnection(data);
    });
  }

  initListeners (socketId, listeners) {
    for (let key in listeners) {
      this.nsp.sockets[socketId].on(key, (data, fn) => {
        listeners[key](data, fn, socketId);
      });
    }
  }

  handler () {

  }

  joinRoom (socketId, roomId, callback) {
    if (this.nsp.sockets[socketId]) {

      this.nsp.sockets[socketId].join(roomId, callback);
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

  getSocket (socketId) {
    return this.nsp.sockets[socketId];
  }

  sendMessageToRoom (room, event, message) {
    //发消息到房间还是给人呢
    this.nsp.to(room).emit(event, message);
  }

  sendMessage (socketId, event, message) {
    this.nsp.sockets[socketId].emit(event, message);
  }

  init (func) {

  }

}