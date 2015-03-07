var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static(__dirname + '/images'));

http.listen(8888, function() {
  console.log('Running...');
});

require('./app/camera').run();

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/images/camera.jpg');
});
