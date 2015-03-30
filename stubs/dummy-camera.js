var constants = require('../app/constants');

module.exports = {
  run: function () {
    'use strict';
    var im = require('imagemagick');
    var path = require('path');
    var fs = require('fs');
    var input = path.resolve(__dirname + '/image.jpg');
    var intermediate = path.resolve(__dirname + '/_image.jpg');
    var output = constants.IMAGE_PATH;

    function createImage() {
      im.convert([
        input,
        '-resize', constants.WIDTH + 'x' + constants.HEIGHT + '^',
        '-crop', constants.WIDTH + 'x' + constants.HEIGHT + '!+0+0',
        '-gravity', 'center',
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
      else { setTimeout(createImage, constants.INTERVAL); }
    }

    createImage();
  }
};
