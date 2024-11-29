module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: [
    'standard'
    // 'prettier'
  ],
  // Plugins: ['prettier'],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  }
  /* rules: {
    camelcase: 'off',
    "prettier/prettier": "error",
  } */
}
