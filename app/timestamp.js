module.exports = {
  add: function (inputPath, outputPath, text, callback) {
    require('imagemagick').convert([
      inputPath,
      '-gravity', 'south',
      '-fill', 'white',
      '-annotate', '0', text,
      outputPath
    ], callback);
  }
};
