const path = require('path')

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const { ESBuildMinifyPlugin } = require('esbuild-loader')

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
      symlinks: false,
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    entry,
    module: {
      rules: [
        {
          test: /\.(tsx?|js)$/,
          use: 'react-hot-loader/webpack',
          include: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'esbuild-loader',
              options: {
                loader: 'css',
                minify: true,
              },
            },
          ],
        },
        {
          test: /\.(tsx?|js)$/,
          include: /(src|shared)/,
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2015',
          },
        },
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
            unsafeCache: false,
          },
        },
      ],
    },
    target,
    context,
    stats: 'errors-only',
    output,
    plugins: [...(plugins || [])],
    optimization: {
      moduleIds: 'named',
      minimizer: [
        new ESBuildMinifyPlugin({
          target: 'es2015',
        }),
      ],
    },
    bail: true,
    experiments: {
      topLevelAwait: true,
    },
    ...rest,
  })
