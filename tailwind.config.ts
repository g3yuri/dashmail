/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class" as const,
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            h1: { color: 'inherit' },
            h2: { color: 'inherit' },
            h3: { color: 'inherit' },
            h4: { color: 'inherit' },
            p: { color: 'inherit' },
            a: { color: 'inherit', textDecoration: 'underline' },
            strong: { color: 'inherit' },
            code: { color: 'inherit', backgroundColor: 'transparent' },
            pre: { backgroundColor: 'transparent' },
          },
        },
      },
    },
  },
  plugins: [],
};

export default config; 