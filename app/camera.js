var constants = require('./constants');
var exec = require('child_process').exec;
var running = false;

module.exports = {
  stop: function () {
    running = false;
  },
  start: function (handleImageData) {
    'use strict';

    function takePhoto() {
      var raspistillCommand = [
          'raspistill',
          '--encoding', 'jpg',
          '--width', constants.WIDTH,
          '--height', constants.HEIGHT,
          '--quality', '50',
          '--rotation', '180',
          '-o', '-'
        ].join(' ');

      var imagemagickCommand = [
          'convert', '-',
          '-gravity', 'south',
          '-fill', 'white',
          '-annotate', '0', '\'' +  new Date().toString() + '\'',
          '-'
        ].join(' ');
      
      var command = [raspistillCommand, '|', imagemagickCommand].join(' ');

      exec(command, {encoding: 'binary', maxBuffer: 1024 * 5000}, handlePhoto);
    }

    function handlePhoto(err, stdout) {
      if (err) { throw err; }
      else {
        handleImageData(stdout);
        if (running) {
          setTimeout(takePhoto, constants.INTERVAL);
        }
      }
    }
    
    running = true;
    takePhoto();
  }
};

