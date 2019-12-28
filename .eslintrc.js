const eslintrc = {
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  plugins: ['react', 'jsx-a11y', 'import'],
  settings: {
    'import/core-modules': [
      'react',
      'react-dom',
      'react-router-dom',
      'config',
      'react-helmet',
      'prop-types',
    ],
  },
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/forbid-prop-types': 0,
    'no-shadow': 'warn',
    'no-console': 0,
    'linebreak-style': 0,
    'import/extensions': [
      2,
      'never',
      {
        'web.js': 'never',
        json: 'never',
        css: 'always'
      },
    ],
  },
  env: {
    browser: true,
  },
};

module.exports = eslintrc;
