import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        border: "hsl(var(--border))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))"
      },
      boxShadow: {
        glow: "0 24px 60px rgba(15, 23, 42, 0.12)",
        xl: "0 20px 50px rgba(15, 23, 42, 0.15)",
        "2xl": "0 25px 60px rgba(15, 23, 42, 0.2)"
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem"
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "ui-serif", "serif"],
        sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
