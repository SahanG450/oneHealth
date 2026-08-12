const preset = require("../../packages/config/tailwind.preset.js");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}", "../../packages/ui-kit/src/**/*.{ts,tsx}"],
  presets: [preset],
  plugins: [],
};
