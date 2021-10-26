const path = require('path')
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const webpackConfig = require('./webpack.config.base')

const root = path.resolve(__dirname, '..')

module.exports = webpackConfig({
  entry: {
    app: path.resolve(root, 'src/clientEntry.tsx'),
    hot: 'webpack/hot/dev-server.js',
    client: 'webpack-dev-server/client/index.js?hot=true&live-reload=true',
  },
  target: 'web',
  mode: 'development',
  devServer: {
    static: 'static',
    compress: true,
    host: '0.0.0.0',
    port: 9001,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    hot: true,
  },
  devtool: 'eval-source-map',
  output: {
    filename: '[name].js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    // new BundleAnalyzerPlugin(),
  ],
  context: root,
})
