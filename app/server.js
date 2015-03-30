module.exports = {
  run: function () {
    'use strict';
    var express = require('express');
    var app = express();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    var fs = require('fs');
    var path = require('path');

    var proc;

    var imagePath = path.resolve(__dirname + '/../images/camera.jpg');

    app.use('/', express.static(path.join(__dirname, '..', 'images')));
    app.get('/', function(req, res) {
      var index = __dirname + '/../views/index.html';
      res.sendFile(path.resolve(index));
    });

    var sockets = {};
    io.on('connection', function(socket) {
      sockets[socket.id] = socket;
      console.log('Total clients connected: ', Object.keys(sockets).length);

      socket.on('disconnect', function() {
        delete sockets[socket.id];

        if (Object.keys(sockets).length === 0) {
          app.set('watchingFile', false);
          if (proc) { proc.kill(); }
          fs.unwatchFile(imagePath);
        }
      });

      socket.on('start-stream', function() {
        startStreaming(io);
      });
    });

    http.listen(8888, function() {
      console.log('listening on *:8888');
    });

    function startStreaming(io) {
      if (app.get('watchingFile')) {
        io.sockets.emit('liveStream', 'camera.jpg?_t=' + (Math.random() * 100000));
        return;
      }
      console.log('Watching for changes...');
      app.set('watchingFile', true);

      fs.watchFile(imagePath, function() {
        io.sockets.emit('liveStream', 'camera.jpg?_t=' + (Math.random() * 100000));
      });
    }
  }
};
