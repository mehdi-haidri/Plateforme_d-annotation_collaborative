module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  safelist: [
    'alert-success',
    'alert-error',
    'alert-warning',
    'alert-info',
  ],
  plugins: [require('daisyui')],
};