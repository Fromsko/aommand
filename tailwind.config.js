/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        crush: {
          primary: "#a855f7",
          secondary: "#22d3ee",
          accent: "#f59e0b",
          neutral: "#27272a",
          "base-100": "#0a0a0a",
          "base-200": "#18181b",
          "base-300": "#27272a",
          info: "#3b82f6",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
      "dark",
    ],
    darkTheme: "crush",
  },
};
