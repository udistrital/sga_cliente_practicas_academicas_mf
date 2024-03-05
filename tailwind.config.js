/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#03678F",
        "primary-0": "#DBE9EF",
        "primary-1": "#B7D3DF",
        "primary-2": "#6FA8BF",
        "primary-3": "#4B92AF",
        "primary-4": "#277C9F",
        "primary-5": "#03678F",
        "primary-100": "#E3F6FF",
        "primary-200": "#BFE8FF",
        "primary-300": "#ABD7F0",
        "primary-400": "#97C6E2",
        "primary-500": "#83B6D4",
        "primary-600": "#6EA5C5",
        "primary-700": "#5A95B8",
        "primary-800": "#4486AA",
        "primary-900": "#2C769C",
        "success-main": "#ACC868",
        "success-base": "#86AB2E",
        "success-accent": "#668F03",
        "warning-main": "#E6D877",
        "warning-base": "#D9C53A",
        "warning-accent": "#CCB304",
        "danger-base": "#C86885",
        "danger-main": "#8F032E",
        "danger-accent": "#AB2E54",
        "others-base": "#86B0D2",
        "others-main": "#4682B4",
        "others-accent": "#145A95",
      },
    },
  },
  plugins: [],
}

