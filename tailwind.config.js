/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // 'class' strategy: add `dark` class to <html> to activate dark mode
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
