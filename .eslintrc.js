module.exports = {
  // parser: 'babel-eslint',
  // extends: 'airbnb',
  globals: {
    chrome: true,
  },
  env: {
    browser: true,
    node: true,
  },
  rules: {
    // 'react/prefer-stateless-function': 0,
    // 'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    // 'jsx-a11y/no-static-element-interactions': 0,
    // 'jsx-a11y/label-has-for': 0,
    // 'consistent-return': 0,
    // 'comma-dangle': 0,
    // 'spaced-comment': 0,
    // 'global-require': 0,
  },
  plugins: ['react'],
};
