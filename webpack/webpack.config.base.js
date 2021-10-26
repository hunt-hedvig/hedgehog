const threadLoader = require('thread-loader')
const path = require('path')
const babelrc = require('../.babelrc')

threadLoader.warmup({}, ['babel-loader'])

module.exports = ({
  mode,
  entry,
  target,
  plugins,
  output,
  context,
  ...rest
}) => ({
  mode,
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.json', '.css'],
    modules: [
      path.resolve(context, 'node_modules'),
      path.resolve(context, 'src'),
      path.resolve(context, 'shared'),
    ],
    symlinks: false,
  },
  entry,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(tsx?|ts)$/,
        include: [
          path.resolve(__dirname, '../src'),
          path.resolve(__dirname, '../shared'),
        ],
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
  plugins: plugins || [],
  optimization: {
    moduleIds: 'named',
  },
  bail: true,
  ...rest,
})
