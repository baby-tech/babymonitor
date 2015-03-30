module.exports = {
  run: function () {
    'use strict';
    var cameraOptions = {
      width: 600,
      mode: 'timelapse',
      output: 'images/camera.jpg',
      quality: 50,
      rotation: 180,
      nopreview: true,
      timeout: 1000,
      timelapse: 4500
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
