const express = require('express');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const router = express.Router();

// localhost:3000 접속시 /chat/chat.html 이동 실행
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/chat/chat.html');
});

var count = 1; // 참여자 번호 발급

io.on('connect', function (socket) {
  console.log('user connected: ', socket.id);
  var name = '익명' + count++;
  socket.name = name;
  io.to(socket.id).emit('create name', name);
  io.emit('new connect', name);

  // 채팅방에서 나갔을 때
  socket.on('disconnect', function () {
    console.log('user disconnected: ' + socket.id + ' ' + socket.name);
    io.emit('new disconnect', socket.name);
  });

  // 채팅을 보냈을 때
  socket.on('send message', function (name, text) {
    var msg = name + ' : ' + text;
    // 닉네임 변경 시
    if (socket.name != name) {
      io.emit('change name', socket.name, name);
      socket.name = name; // name 업데이트
    }
    console.log(msg);
    io.emit('receive message', msg);
  });
});

server.listen(3000, function () {
  console.log('Socket IO server listening on port 3000');
});

module.exports = router;
