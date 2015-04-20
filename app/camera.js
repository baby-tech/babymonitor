var constants = require('./constants');
var exec = require('child_process').exec;
var moment = require('moment');
var running = false;

module.exports = {
  stop: function () {
    'use strict';

    running = false;
  },
  start: function (handleImageData) {
    'use strict';

    function takePhoto() {
      var command = [
          'raspistill',
          '--timeout', constants.MAX_EXPOSURE_TIME,
          '--encoding', 'jpg',
          '--width', constants.WIDTH,
          '--height', constants.HEIGHT,
          '--quality', '50',
          '--rotation', '180',
          // Text must start with a non-digit character.
          // Raspistill interprets a start digit as a bitmask for flags.
          '--annotate', '"Time: ' +  moment().format('YYYY-MM-DD HH:mm:ss') + '"',
          '-o', '-'
        ].join(' ');

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
