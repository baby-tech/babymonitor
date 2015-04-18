module.exports = {
  run: function () {
    'use strict';
    var express = require('express');
    var app = express();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    var path = require('path');

    var camera = require('./camera');

    var proc;

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
          app.set('cameraRunning', false);
          if (proc) { proc.kill(); }
          camera.stop();
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
      if (app.get('cameraRunning')) {
        return;
      }
      console.log('Camera running...');
      app.set('cameraRunning', true);

      camera.start(function(imageData) {
        var imageEncoded = new Buffer(imageData, 'binary').toString('base64');
        var imageUrl = 'data:image/jpeg;base64,' + imageEncoded;
        
        io.sockets.emit('liveStream', imageUrl);
      });
    }
  }
};
