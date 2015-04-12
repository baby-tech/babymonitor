var constants = require('./constants');
var exec = require('child_process').exec;

module.exports = {
  run: function () {
    'use strict';

    function takePhoto() {
      var command = ['raspistill', '--width', constants.WIDTH, '--height', constants.HEIGHT, '--output', constants.IMAGE_PATH, '--quality', '50', '--rotation', '180'].join(' ');
      console.log(command);
      exec(command, function (err) {
        if (err) {
          throw err;
        }
        setTimeout(takePhoto, constants.INTERVAL);
      });
    }
    takePhoto();
  }
};
