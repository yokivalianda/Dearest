import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blush:    '#F2D7D9',
        rose:     '#D4909A',
        'rose-deep': '#A85C68',
        petal:    '#F9EEF0',
        lavender: '#E8E0EE',
        lilac:    '#C4B0D4',
        ivory:    '#FAF6F1',
        warm:     '#EDE3D8',
        'text-main': '#3A2A2E',
        muted:    '#8A7078',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:  ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

export default config
