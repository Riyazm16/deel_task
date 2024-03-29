module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'guard-for-in': 'off',
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'global-require': 'off',
    'no-console': 'off',
    'no-plusplus': 'off',
    'func-names': 'off',
    'object-shorthand': 'off',
    'consistent-return': 'off',
    'default-param-last': 'off',
    radix: 'off',
    'import/no-unresolved': 'off',
    'max-len': 'off',
    'new-cap': 'off',
    'import/extensions': 'off',
    'prefer-const': 'off',
    'no-await-in-loop': 'off',

  },
};
