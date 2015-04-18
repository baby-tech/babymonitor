var constants = require('./constants');
var ts = require('./timestamp');
var temp = require('temp');
var exec = require('child_process').exec;

module.exports = {
  run: function () {
    'use strict';

    var intermediatePath = temp.path({suffix: '.jpg'});

    function takePhoto() {
      exec([
          'raspistill',
          '--width', constants.WIDTH,
          '--height', constants.HEIGHT,
          '--output', intermediatePath,
          '--quality', '50',
          '--rotation', '180'
        ].join(' '), handlePhoto);
    }

    function handlePhoto(err) {
      if (err) { throw err; }
      else { ts.add(intermediatePath, constants.IMAGE_PATH, new Date().toString(), handleStamp); }
    }

    function handleStamp(err) {
      if (err) { throw err; }
      else { setTimeout(takePhoto, constants.INTERVAL); }
    }

    takePhoto();
  }
};
