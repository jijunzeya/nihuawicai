var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io')(http);
import User from './beans/user';

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
  console.log('@@##import:' + User.UUID());
});

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.broadcast.emit('hi');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('chat message', function (msg) {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });


});

http.listen(3000, function () {
  console.log('listening on *:3000');
});