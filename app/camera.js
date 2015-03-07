module.exports = {
  run: function () {
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

    var camera = new require("raspicam")(cameraOptions);
    camera.start();

    camera.on("exit", function()
    {
        camera.stop();
        console.log('Restarting camera...')
        camera.start()
    });
  }
};
