

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#6A5ACD",
        primaryDark: "#5B4BBD",
        secondary: "#FFC107",
        accent: "#00BCD4",
        accentDark: "#0097A7",
        background: "#F0F4F8",
        surface: "#FFFFFF",
        surfaceVariant: "#EAECEE",
        textPrimary: "#2C3E50",
        textSecondary: "#7F8C8D",
        textMuted: "#BDC3C7",
        border: "#DDE4EB",
        success: "#2ECC71",
        warning: "#F39C12",
        error: "#E74C3C",
      },
      fontFamily: {

        poppins: ['Poppins_400Regular', 'sans-serif'],
        'poppins-semibold': ['Poppins_600SemiBold', 'sans-serif'],
        'poppins-bold': ['Poppins_700Bold', 'sans-serif'],
      },
    },
  },
  plugins: [
    ({ addBase }) =>
      addBase({
        ".light": {
          "--foreground": "#171717",
          "--background-color": "#f3f5f7",
          "--nav-text-color": "rgba(41, 39, 45, 0.733)",
          "--card-background-color": "#ffffff",
          "--hover-backgroud-color": "#cdcdcd4d",
          "--card-border-color": "#e4e4e4",
          "--text-color": "#050109",
          "--sidebar-background-color": "#ffffff",
          "--field-background-color": "#e4e4e4"
        },
        ".dark": {
          "--foreground": "#ededed",
          "--background-color": "#101010",
          "--nav-text-color": "rgba(255, 255, 255, 0.6)",
          "--card-background-color": "#27272a4d",
          "--hover-backgroud-color": "#3636384d",
          "--card-border-color": "#1e1e20",
          "--text-color": "#ffffff",
          "--sidebar-background-color": "#181819",
          "--field-background-color": "#27272a4d",
          "--combobox-background-color": "#27272a"

        }
      }),

  ],
}