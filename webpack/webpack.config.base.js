const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const { ESBuildMinifyPlugin } = require('esbuild-loader')

const smp = new SpeedMeasurePlugin()

module.exports = ({ mode, entry, target, plugins, output, context, ...rest }) =>
  smp.wrap({
    mode,
    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.css'],
      alias: {
        'react-dom': require.resolve('@hot-loader/react-dom'),
      },
    },
    entry,
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            require.resolve('style-loader'),
            require.resolve('css-loader'),
            {
              loader: require.resolve('esbuild-loader'),
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
          loader: require.resolve('esbuild-loader'),
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
