import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nova: {
          sun: '#FFB800',
          sky: '#4A90D9',
          earth: '#8B4513',
          leaf: '#2D8B4E',
          clay: '#D2691E',
          sand: '#F5DEB3',
        },
      },
      fontFamily: {
        display: ['Nunito', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
