const theme = require('./config/theme.json')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: theme.colors.primary,
        success: theme.colors.success,
        error: theme.colors.error,
        background: theme.colors.background,
        text: theme.colors.text,
        border: theme.colors.border,
      },
      borderRadius: theme.borderRadius,
      boxShadow: {
        card: theme.shadows.card,
      },
    },
  },
  plugins: [],
}
