module.exports = {
  run: function () {
    'use strict';
    var im = require('imagemagick');
    var path = require('path');
    var fs = require('fs');
    var input = path.resolve(__dirname + '/image.jpg');
    var intermediate = path.resolve(__dirname + '/../images/_camera.jpg');
    var output = path.resolve(__dirname + '/../images/camera.jpg');

    function createImage() {
      im.convert([
        input,
        '-gravity', 'south',
        '-fill', 'white',
        '-annotate', '0', new Date(),
        intermediate
      ], handleImageCreation);
    }

    function handleImageCreation(err) {
      if (err) { throw err; }
      else { moveImage(); }
    }

    function moveImage() {
      fs.rename(intermediate, output, handleImageMove);
    }

    function handleImageMove(err) {
      if (err) { throw err; }
      else { setTimeout(createImage, 4500); }
    }

    createImage();
  }
};
