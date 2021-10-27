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
          include: /(src|shared)/,
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
            unsafeCache: true,
          },
        },
      ],
    },
    target,
    context,
    stats: 'errors-only',
    output,
    plugins: [
      /*
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: path.join(__dirname, '../build', 'vendor-manifest.json'),
      }),
      */
      ...(plugins || []),
    ],
    optimization: {
      moduleIds: 'named',
    },
    bail: true,
    ...rest,
  })
