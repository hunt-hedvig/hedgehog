const webpack = require('webpack')
const threadLoader = require('thread-loader')
const path = require('path')
const babelrc = require('../.babelrc')

threadLoader.warmup({}, ['babel-loader'])

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const smp = new SpeedMeasurePlugin()

module.exports = ({ mode, entry, target, plugins, output, context, ...rest }) =>
  smp.wrap({
    mode,
    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.json', '.css'],
      modules: [
        path.resolve(context, 'node_modules'),
        path.resolve(context, 'src'),
        path.resolve(context, 'shared'),
      ],
    },
    entry,
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(tsx?|js)$/,
          exclude: /(node_modules)/,
          use: [
            'thread-loader',
            {
              loader: 'babel-loader',
              options: { ...babelrc, cacheDirectory: true },
            },
          ],
        },
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
    target,
    context,
    stats: 'errors-only',
    output,
    plugins: [
      new webpack.IgnorePlugin({ resourceRegExp: /^moment($|\/)/ }),
      ...(plugins || []),
    ],
    optimization: {
      moduleIds: 'named',
    },
    bail: true,
    ...rest,
  })
