/*
    This is the configuration file for ES-Lint, which is a code style tool.
    It is configured to issue warnings and errors when commiting to git.
*/

module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/no-namespace": "off",
    '@typescript-eslint/no-var-requires': 0
  }
}
