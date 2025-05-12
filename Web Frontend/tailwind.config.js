/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontSize: {
        '1.5xl': '1.375rem', // Midway between xl (1.25rem) and 2xl (1.5rem)
      },
      },
    },
    plugins: [],
  };
  