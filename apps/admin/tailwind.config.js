/** @type {import('tailwindcss').Config} */
import designTokens from '../../packages/design-tokens/dist/tailwind-theme.js';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    ...designTokens,
    extend: {
      ...designTokens.extend,
      borderWidth: {
        ...designTokens.extend.borderWidth,
        '3': '3px',
      },
      ringWidth: {
        '3': '3px',
      },
      ringOffsetWidth: {
        '3': '3px',
      },
      ringColor: {
        ink: '#111111',
        lilac: '#D9C6FF',
      },
      ringOffsetColor: {
        lilac: '#D9C6FF',
      },
    },
  },
  plugins: [],
  darkMode: 'media',
}