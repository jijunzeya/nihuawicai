'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _SocketHandler = require('./handler/SocketHandler');

var _SocketHandler2 = _interopRequireDefault(_SocketHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var server = _http2.default.Server(app);

var port = process.env.PORT || 3000;

// console.log('@@##the dirname is :' + __dirname);

app.use(_express2.default['static']('./'));

var sh = new _SocketHandler2.default(server);
sh.init(function (result) {
  console.log('@@##socket handler init :' + result);
});

server.listen(port, function () {
  console.log('[INFO] Listening on *:' + port);
});
//# sourceMappingURL=app.js.map