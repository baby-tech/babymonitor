module.exports = {
  run: function () {
    var cameraOptions = {
      width: 600,
      height: 338,
      mode: "timelapse",
      awb: 'cloud',
      output: 'images/camera.jpg',
      q: 50,
      rot: 270,
      nopreview: true,
      timeout: 1000,
      timelapse: 9999,
      th: "0:0:0"
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
