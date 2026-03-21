import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00628d",
          container: "#267baa",
        },
        secondary: {
          DEFAULT: "#006874",
          container: "#97f0ff",
        },
        surface: {
          DEFAULT: "#f7f9fb",
          "container-low": "#f2f4f6",
          "container-lowest": "#ffffff",
        },
        tertiary: {
          DEFAULT: "#4d6358",
          fixed: "#69ff87",
        },
        "on-surface": "#191c1e",
        "on-primary": "#ffffff",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#001f24",
        "on-tertiary-container": "#081f12",
        "outline-variant": "#c1c6d7",
        "surface-container": "#eceef0",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e1e3e5",
        "on-surface-variant": "#43474e",
      },
      fontFamily: {
        display: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.1", fontWeight: "800" }],
        "headline-sm": ["1.5rem", { lineHeight: "1.3", fontWeight: "700" }],
        "title-md": ["1.125rem", { lineHeight: "1.4", fontWeight: "600" }],
        "body-md": ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        "label-sm": ["0.75rem", { lineHeight: "1.4", fontWeight: "500" }],
      },
      borderRadius: {
        md: "0.75rem",
        xl: "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        ambient: "0px 12px 32px rgba(25, 28, 30, 0.04)",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
