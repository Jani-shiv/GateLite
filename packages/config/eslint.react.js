const baseConfig = require('./eslint.base.js');

module.exports = {
  ...baseConfig,
  extends: [
    ...baseConfig.extends,
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: [...baseConfig.plugins, 'react', 'react-hooks', 'jsx-a11y'],
  settings: {
    react: {
      version: '18.2',
    },
  },
  rules: {
    ...baseConfig.rules,
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
  },
};