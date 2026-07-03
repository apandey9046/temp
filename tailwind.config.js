/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAFA",
        surface: "#FFFFFF",
        secondary: "#F5F5F5",
        border: "#E8E8E8",
        divider: "#ECECEC",
        primary: "#111111",
        muted: "#999999",
        "secondary-text": "#666666",
        hover: "#F2F2F2",
        active: "#ECECEC",
      },
      fontFamily: {
        fredoka: ["Fredoka", "sans-serif"],
        playpen: ["Playpen Sans", "cursive"],
      },
      borderRadius: {
        button: "14px",
        card: "18px",
        input: "14px",
        modal: "24px",
        dropdown: "16px",
        toast: "16px",
      },
      boxShadow: {
        premium: "0 4px 20px rgba(0,0,0,.04)",
      },
    },
  },
  plugins: [],
}
