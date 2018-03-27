import express from "express";
import http from "http";
import SocketIO from "socket.io";

import User from "./beans/User";
import Room from "./beans/Room";

let app = express();
let server = http.Server(app);
let io = new SocketIO(server);
let port = process.env.PORT || 3000;

console.log('@@##the dirname is :'+__dirname);
app.use(express["static"]('./'));

let users = [];
// let sockets = {};

let nsp = io.of("/chat");
let roomNO = 0;
//房间{id:room,id2:room2}
let rooms = {};
// let nsp =io;
nsp.on("connection", socket => {
  // let nick = socket.handshake.query.nick;
  console.log("@@##who join :" + socket.handshake.query.name);
  let nick = socket.handshake.query.name;
  let currentUser = {
    id: socket.id,
    nick: nick
  };

  let user = new User(currentUser.id, currentUser.nick);
  user.socket = socket;

  console.log("@@##uuid:" + user.getID());

  console.log("[INFO] User " + currentUser.nick + " connected!");
  // sockets[currentUser.id] = socket;
  users.push(currentUser);
  io.emit("userJoin", { nick: currentUser.nick });
  console.log("[INFO] Total users: " + users.length);

  socket.on("ding", () => {
    socket.emit("dong");
  });

  socket.on("disconnect", () => {
    console.log("[INFO] User " + currentUser.nick + " disconnected!");
    socket.broadcast.emit("userDisconnect", { nick: currentUser.nick });
  });

  // 获取分组信息
  // //获取所有房间（分组）信息
  // io.sockets.manager.rooms
  // //来获取此socketid进入的房间信息
  // io.sockets.manager.roomClients[socket.id]
  // //获取particular room中的客户端，返回所有在此房间的socket实例
  // io.sockets.clients('particular room')

  socket.on("userChat", data => {
    console.log(
      "[CHAT]" + nick + ": " + data + " " + JSON.stringify(socket.rooms)
    );

    for (let room in socket.rooms) {
      if (room.indexOf("room") != -1) {
        console.log("@@##soket room :" + room);
        nsp.to(room).emit("serverSendUserChat", { nick: nick, message: data });
      } else {
      }
    }
  });

  //创建房间
  socket.on("createRoom", data => {
    console.log("[CHAT]create room :" + data.name);
    roomNO++;
    socket.join("room" + roomNO, function() {
      const room = new Room(roomNO);
      room.join(user);
      rooms["room" + roomNO] = room;
      socket.emit("joinedRoom", { code: 0, roomNO: roomNO });
    });
  });

  //加入房间
  socket.on("joinRoom", data => {
    console.log("@@##[CHAT]join room :" + JSON.stringify(data));
    console.log("@@##rooms:" + socket.rooms);

    let curRoom = rooms["room" + data.roomNO];
    if (!curRoom) {
      console.log("@@##joinRoom fail!" + data);
      socket.emit("joinedRoom", { result: "不存在房间号:" + data.roomNO, code: -1 });
      return;
    } else {
      if (curRoom.users.length >= 4) {
        socket.emit("joinedRoom", { result: "已满座", code: -1 });
        return;
      }
    }
    socket.join("room" + data.roomNO, function() {
      console.log("join rooms:" + JSON.stringify(curRoom.id));
      curRoom.join(user);
      //   console.log("@@##joined room info :" + JSON.stringify(curRoom.users));
      nsp.to("room" + data.roomNO).emit("serverSendUserChat", {
        nick: nick,
        message: "我在" + data.roomNO
      });
      socket.emit("joinedRoom", { code: 0, roomNO: roomNO });
    });
  });
});

server.listen(port, () => {
  console.log("[INFO] Listening on *:" + port);
});
