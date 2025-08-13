module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true, jest: false },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    project: undefined,
  },
  plugins: ['@typescript-eslint', 'react'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  rules: {
    'react/no-danger': 'error',
    'no-restricted-properties': [
      'error',
      { object: 'document', property: 'write', message: 'Avoid document.write for security.' }
    ],
    '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: false }],
  },
  settings: {
    react: { version: 'detect' },
  },
}

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react/no-unescaped-entities': 'off'
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
