module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: true, // or 'media' or 'class'
  theme: {
    extend: {
      visibility: ["group-hover"],
      fontFamily: {
        sans: ['var(--font-poppins)'],
        congratulation: ['var(--font-poppinsSmall)']
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
