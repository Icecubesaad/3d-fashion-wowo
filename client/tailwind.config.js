/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Clay design tokens (DESIGN.md) */
        ink: "#0a0a0a",
        body: "#3a3a3a",
        "body-strong": "#1a1a1a",
        "muted-ink": "#6a6a6a",
        "muted-soft": "#9a9a9a",
        hairline: "#e5e5e5",
        "hairline-soft": "#f0f0f0",
        canvas: "#fffaf0",
        "surface-soft": "#faf5e8",
        "surface-card": "#f5f0e0",
        "surface-strong": "#ebe6d6",
        "surface-dark": "#0a1a1a",
        "surface-dark-elevated": "#1a2a2a",
        brand: {
          pink: "#ff4d8b",
          teal: "#1a3a3a",
          lavender: "#b8a4ed",
          peach: "#ffb084",
          ochre: "#e8b94a",
          mint: "#a4d4c5",
          coral: "#ff6b5a",
        },
        success: "#22c55e",
        warning: "#f59e0b",
        error: "#ef4444",
      },
      borderRadius: {
        xs: "6px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        pill: "9999px",
      },
      spacing: {
        section: "96px",
      },
      maxWidth: {
        content: "1280px",
      },
      fontSize: {
        "display-xl": ["72px", { lineHeight: "1", letterSpacing: "-2.5px", fontWeight: "500" }],
        "display-lg": ["56px", { lineHeight: "1.05", letterSpacing: "-2px", fontWeight: "500" }],
        "display-md": ["40px", { lineHeight: "1.1", letterSpacing: "-1px", fontWeight: "500" }],
        "display-sm": ["32px", { lineHeight: "1.15", letterSpacing: "-0.5px", fontWeight: "500" }],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
