import express from 'express';
import http from 'http';


import SocketHandler from './handler/SocketHandler';

let app = express();
let server = http.Server(app);

let port = process.env.PORT || 3000;

// console.log('@@##the dirname is :' + __dirname);

app.use(express['static']('./'));

let sh = new SocketHandler(server);
sh.init(result => {
  console.log('@@##socket handler init :' + result);
});


server.listen(port, () => {
  console.log('[INFO] Listening on *:' + port);
});
