/** @type {import('tailwindcss').Config} */
export default {
  // Enable dark mode using the "dark" class on html element.
  darkMode: 'class',
  // Tell Tailwind where to scan for class names.
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Keep default theme and extend later when needed.
  theme: {
    extend: {},
  },
  // No extra Tailwind plugins for now.
  plugins: [],
};
