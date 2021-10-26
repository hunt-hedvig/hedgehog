const webpack = require('webpack')
const path = require('path')
const { StatsWriterPlugin } = require('webpack-stats-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const webpackConfig = require('./webpack.config.base')

const root = path.resolve(__dirname, '..')

module.exports = webpackConfig({
  entry: {
    app: ['react-hot-loader/patch', path.resolve(root, 'src/clientEntry.tsx')],
  },
  target: 'web',
  mode: 'production',
  context: root,
  output: {
    filename: '[name]-[contenthash].js',
    publicPath: '/static/',
    path: path.resolve(root, 'build'),
  },
  devtool: 'source-map',
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new StatsWriterPlugin({ filename: 'stats.json' }),
    // new BundleAnalyzerPlugin(),
  ].filter(Boolean),
})
