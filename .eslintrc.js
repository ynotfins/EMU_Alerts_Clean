module.exports = {
  extends: ['expo', '@expo/eslint-config-expo'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // Customize rules as needed
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
  ignorePatterns: [
    'node_modules/',
    '.expo/',
    'functions/',
    'dist/',
    'build/',
  ],
};
