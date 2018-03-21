const path = require('path');

  module.exports = {
  entry: './babel/main.bundle.js',
  output: {
    path: path.resolve(__dirname, "build"),
    filename: 'main.bundle.js'
  }
}; 