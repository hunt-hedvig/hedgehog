module.exports = (api) => {
  api.cache(true)

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'usage',
          corejs: 2,
          targets: {
            browsers: ['last 3 versions'],
          },
        },
      ],
      '@babel/preset-react',
      ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
    ],
    plugins: [
      '@emotion',
      'react-hot-loader/babel',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
    ],
    env: {
      test: {
        plugins: [
          '@emotion',
          '@babel/plugin-syntax-dynamic-import',
          '@babel/transform-modules-commonjs',
          '@babel/plugin-transform-runtime',
          'babel-plugin-dynamic-import-node',
        ],
      },
    },
  }
}
