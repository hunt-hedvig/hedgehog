const path = require('path')

module.exports = {
  stories: ['../shared/**/*.stories.ts', '../shared/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
  ],
  webpackFinal: async (config) => {
    config.resolve.modules.push(path.resolve(__dirname, '../shared'))
    config.module.rules.push({
      test: /\.(tsx?|js)$/,
      include: /(src|shared)/,
      loader: 'esbuild-loader',
      options: {
        loader: 'tsx',
        target: 'es2015',
      },
    })
    config.resolve.extensions.push('.ts', '.tsx')

    return config
  },
}
