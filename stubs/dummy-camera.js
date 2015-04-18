var constants = require('../app/constants');
var timestamp = require('../app/timestamp');

module.exports = {
  run: function () {
    'use strict';
    var im = require('imagemagick');
    var path = require('path');
    var mv = require('mv');
    var temp = require('temp');

    var input = path.resolve(__dirname + '/image.jpg');
    var intermediate = temp.path({suffix: '.jpg'});
    var anotherIntermediate = temp.path({suffix: '.jpg'});
    var output = constants.IMAGE_PATH;

    function createImage() {
      im.convert([
        input,
        '-resize', constants.WIDTH + 'x' + constants.HEIGHT + '^',
        '-crop', constants.WIDTH + 'x' + constants.HEIGHT + '!+0+0',
        intermediate
      ], handleImageCreation);
    }

    function handleImageCreation(err) {
      if (err) { throw err; }
      else {
        timestamp.add(
          intermediate,
          anotherIntermediate,
          new Date().toString(),
          handleAddStamp
        );
      }
    }

    function handleAddStamp(err) {
      if (err) { throw err; }
      else { moveImage(); }
    }

    function moveImage() {
      mv(anotherIntermediate, output, handleImageMove);
    }

    function handleImageMove(err) {
      if (err) { throw err; }
      else { setTimeout(createImage, constants.INTERVAL); }
    }

    createImage();
  }
};
