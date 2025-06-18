const { getIconCollections, iconsPlugin } = require('@egoist/tailwindcss-icons')
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    './components/**/*.{js,jsx,ts,tsx,md,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,jsx,ts,tsx,md,mdx}',
    './theme.config.tsx',
  ],
  plugins: [
    iconsPlugin({ collections: getIconCollections(['ri']) }),
    require('@tailwindcss/aspect-ratio'),
    addVariablesForColors,
  ],
  theme: {
    extend: {
      animation: { spotlight: 'spotlight 2s ease .75s 1 forwards' },
      keyframes: {
        spotlight: {
          '0%': {
            opacity: 0,
            transform: 'translate(-72%, -62%) scale(0.5)',
          },
          '100%': {
            opacity: 1,
            transform: 'translate(-50%,-40%) scale(1)',
          },
        },
      },
    },
  },
}

function addVariablesForColors({ addBase, theme }) {
  const allColors = flattenColorPalette(theme('colors'))
  const newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]))

  addBase({ ':root': newVars })
}
