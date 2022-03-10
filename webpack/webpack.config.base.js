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
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2017',
          },
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
      minimizer: [
        new ESBuildMinifyPlugin({
          target: 'es2017',
          css: true,
        }),
      ],
    },
    bail: true,
    experiments: {
      topLevelAwait: true,
    },
    ...rest,
  })
