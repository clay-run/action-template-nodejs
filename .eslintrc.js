module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 11
  },
  plugins: [],
  rules: {
    'no-unused-vars': 0,
    'no-useless-escape': 0,
    'no-trailing-spaces': 2,
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always',
    }],
    'func-call-spacing': ['error', 'never'],
    'keyword-spacing': ['error', {
      overrides: {
        for: { after: false },
        while: { after: false },
        if: { after: false },
      },
    }],
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'never'],
  },
};