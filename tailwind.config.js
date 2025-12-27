/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/ayuAtama/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/ayuAtama/*.{js,ts,jsx,tsx,mdx}",
    "./components/ayuAtama/*.{js,ts,jsx,tsx,mdx}",
    "./components/ayuAtama/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        scalePulse: {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        rgbPulse: {
          "0%": { color: "rgb(255,0,0)" },
          "33%": { color: "rgb(0,255,0)" },
          "66%": { color: "rgb(0,0,255)" },
          "100%": { color: "rgb(255,0,0)" },
        },
        glowPulse: {
          "0%,100%": { boxShadow: "0 0 12px rgba(255,0,150,0.6)" },
          "50%": { boxShadow: "0 0 28px rgba(0,200,255,0.9)" },
        },
      },
      animation: {
        pulseScale: "scalePulse 1.8s ease-in-out infinite",
        pulseRGB: "rgbPulse 3s linear infinite",
        pulseGlow: "glowPulse 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
