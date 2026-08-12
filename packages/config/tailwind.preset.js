/** OneHealth brand tokens — sampled from logo (#1C8FE0 bright, deep navy frame). */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F0F8FD",
          100: "#D9EEFA",
          200: "#B3DCF5",
          300: "#7CC4ED",
          400: "#3FA8E4",
          500: "#1C8FE0",
          600: "#1474C2",
          700: "#0F5A99",
          800: "#0B4575",
          900: "#0A3A66",
          950: "#06243F",
        },
        navy: {
          DEFAULT: "#0A3A66",
          soft: "#0F2744",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F5FAFD",
          border: "#E2EBF3",
        },
        ink: {
          DEFAULT: "#0F2744",
          muted: "#5B6B7C",
          faint: "#8A9AAB",
        },
      },
      fontFamily: {
        sans: ['"Manrope"', "ui-sans-serif", "sans-serif"],
        display: ['"Outfit"', "ui-sans-serif", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 28px rgba(10, 58, 102, 0.08)",
        focus: "0 0 0 3px rgba(28, 143, 224, 0.25)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #1C8FE0 0%, #0A3A66 100%)",
        "brand-gradient-hover": "linear-gradient(135deg, #3FA8E4 0%, #0F5A99 100%)",
      },
      keyframes: {
        "oh-spin": {
          to: { transform: "rotate(360deg)" },
        },
        "oh-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
      },
      animation: {
        "oh-spin": "oh-spin 0.9s linear infinite",
        "oh-pulse": "oh-pulse 1.4s ease-in-out infinite",
      },
    },
  },
};
