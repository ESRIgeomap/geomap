const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const pkg = require('../package.json');
let dependencies = Object.keys(pkg.dependencies) || [];
dependencies = dependencies.length > 0 ? dependencies.filter(item => item !== 'vue') : [];

module.exports = {
  entry: {
    vendor: dependencies,
  },
  output: {
    path: path.join(__dirname, '../static'),
    filename: 'dll.[name]_[hash:6].js',
    library: '[name]_[hash:6]',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../', '[name]-manifest.json'),
      name: '[name]_[hash:6]',
    }),
    new AssetsPlugin({
      filename: 'bundle-config.json',
      path: './',
    }),
  ],
};
