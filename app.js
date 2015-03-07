require('./app/camera').run();
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');
 
var spawn = require('child_process').spawn;
var proc;
 
app.use('/', express.static(path.join(__dirname, 'images')));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
 
var sockets = {};
io.on('connection', function(socket) {
  sockets[socket.id] = socket;
  console.log('Total clients connected: ', Object.keys(sockets).length);
 
  socket.on('disconnect', function() {
    delete sockets[socket.id];
 
    if (Object.keys(sockets).length == 0) {
      app.set('watchingFile', false);
      if (proc) proc.kill();
      fs.unwatchFile('./images/camera.jpg');
    }
  });
 
  socket.on('start-stream', function() {
    startStreaming(io);
  });
});
 
http.listen(8888, function() {
  console.log('listening on *:8888');
});
 
function stopStreaming() {
  if (Object.keys(sockets).length == 0) {
    app.set('watchingFile', false);
    if (proc) proc.kill();
    fs.unwatchFile('./images/camera.jpg');
  }
}
 
function startStreaming(io) {
  if (app.get('watchingFile')) {
    io.sockets.emit('liveStream', 'camera.jpg?_t=' + (Math.random() * 100000));
    return;
  }
  console.log('Watching for changes...');
  app.set('watchingFile', true);
 
  fs.watchFile('./images/camera.jpg', function(current, previous) {
    io.sockets.emit('liveStream', 'camera.jpg?_t=' + (Math.random() * 100000));
  })
}

