var constants = require('./constants');

module.exports = {
  run: function () {
    'use strict';
    var cameraOptions = {
      width: constants.WIDTH,
      height: constants.HEIGHT,
      mode: 'timelapse',
      output: constants.IMAGE_PATH,
      quality: 50,
      rotation: 180,
      nopreview: true,
      timeout: 1000,
      timelapse: constants.INTERVAL
    };

    var RaspiCam = require('raspicam');
    var camera = new RaspiCam(cameraOptions);
    camera.start();

    camera.on('exit', function()
    {
        camera.stop();
        console.log('Restarting camera...');
        camera.start();
    });
  }
};
