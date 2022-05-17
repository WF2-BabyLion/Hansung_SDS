const express = require('express');
var app = require('express')();
var server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);

const router = express.Router();

var socketList = [];

// localhost:3000으로 서버에 접속하면 클라이언트로 index.html을 전송한다
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/chat/chat.html');
});

io.on('connection', function (socket) {
  socketList.push(socket);
  console.log('User Join');

  socket.on('SEND', function (msg) {
    console.log(msg);
    socketList.forEach(function (item, i) {
      console.log(item.id);
      if (item != socket) {
        item.emit('SEND', msg);
      }
    });
  });

  socket.on('disconnect', function () {
    socketList.splice(socketList.indexOf(socket), 1);
  });
});

server.listen(3000, function () {
  console.log('Socket IO server listening on port 3000');
});

module.exports = router;
