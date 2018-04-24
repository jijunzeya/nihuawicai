
import SocketIO from 'socket.io';

// import User from './beans/User';
// import Room from './beans/Room';
import ChatHandler from './ChatHandler';
export default class SocketHandler {
  rooms = {};
  chatHandlers = {};

  constructor(server) {
    let io = new SocketIO(server);
    let nsp = io.of('/chat');

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
    nsp.on('connection', socket => {
      console.log('@@##nsp connection :' + socket.id);
      let chatHandler = new ChatHandler(nsp, this.rooms, socket, (roomId) => {
        //创建room成功
        console.log('@@##创建房间成功:' + roomId);
      }, (roomId) => {
        // 加入room成功
        console.log('@@##加入房间成功:' + roomId);
      });
      this.chatHandlers[socket.id] = chatHandler;
      console.log('@@##connection:' + chatHandler._user.nickName);
      // console.log('@@##connection:' + this.chatHandlers.keys());
      socket.on('disconnect', () => {
        console.log('@@##socket disconnect:' + socket.id);
        delete this.chatHandlers[socket.id];
        // console.log('@@##disconnect:' + JSON.stringify(this.chatHandlers));
      })

    });

  }

  init (func) {

  }

}