import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        sm: "8px",
        md: "16px",
        lg: "24px"
      },
      boxShadow: {
        sm: "0 1px 2px rgb(0 0 0 / .06)",
        md: "0 2px 8px rgb(0 0 0 / .08)"
      },
      transitionTimingFunction: {
        calm: "cubic-bezier(0.2,0,0,1)"
      },
      colors: {
        primary: "#2563EB",
        positive: "#14B8A6"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["'Source Serif Pro'", "ui-serif", "Georgia"]
      }
    }
  },
  plugins: []
} satisfies Config;
