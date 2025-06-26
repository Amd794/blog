/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.{html,js}",
    "./content/**/*.{md,html}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3182CE',
        'primary-light': '#4299E1',
        'primary-dark': '#2B6CB0',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: {
              color: theme('colors.primary'),
              '&:hover': {
                color: theme('colors.primary-dark'),
              },
            },
            'h2, h3, h4, h5, h6': {
              color: theme('colors.gray.900'),
            },
            pre: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.gray.100'),
            },
            code: {
              color: theme('colors.primary'),
              backgroundColor: theme('colors.gray.100'),
              padding: '0.25rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.200'),
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.300'),
              },
            },
            'h2, h3, h4, h5, h6': {
              color: theme('colors.gray.100'),
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
            },
            code: {
              color: theme('colors.blue.400'),
              backgroundColor: theme('colors.gray.800'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 