const path = require('path')

module.exports = {
  stories: ['../shared/**/*.stories.ts', '../shared/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs/register',
  ],
  webpackFinal: async (config) => {
    // do mutation to the config

    config.resolve.modules.push(path.resolve(__dirname, '../shared'))
    config.module.rules.push({
      test: /\.tsx?$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
        },
      ],
    })
    config.resolve.extensions.push('.ts', '.tsx')

    return config
  },
}
