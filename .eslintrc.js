module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    // 'plugin:vue/essential',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'no-undef': 'off',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'import/prefer-default-export': 'off',
  },
};
