import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0a0f1a",
          primary: "#0a0f1a",
          secondary: "#111827",
          tertiary: "#1a2332",
          surface: "#242d3d",
          elevated: "#2d3748",
        },
        foreground: {
          DEFAULT: "#f8fafc",
          primary: "#f8fafc",
          secondary: "#94a3b8",
          tertiary: "#64748b",
          muted: "#475569",
        },
        brand: {
          DEFAULT: "#10b981",
          hover: "#059669",
          muted: "#065f46",
        },
        profit: {
          DEFAULT: "#22c55e",
          bg: "rgba(34, 197, 94, 0.1)",
          border: "rgba(34, 197, 94, 0.3)",
        },
        loss: {
          DEFAULT: "#ef4444",
          bg: "rgba(239, 68, 68, 0.1)",
          border: "rgba(239, 68, 68, 0.3)",
        },
        warning: {
          DEFAULT: "#f59e0b",
          bg: "rgba(245, 158, 11, 0.1)",
        },
        info: {
          DEFAULT: "#3b82f6",
          bg: "rgba(59, 130, 246, 0.1)",
        },
        border: {
          DEFAULT: "#1f2937",
          subtle: "#374151",
        },
        // shadcn/ui required colors
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "glow-profit": "0 0 40px rgba(34, 197, 94, 0.15)",
        "glow-loss": "0 0 40px rgba(239, 68, 68, 0.15)",
        "glow-brand": "0 0 40px rgba(16, 185, 129, 0.2)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
      },
      backgroundImage: {
        "gradient-card": "linear-gradient(145deg, #1a2332 0%, #111827 100%)",
        "gradient-profit": "linear-gradient(145deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)",
        "gradient-loss": "linear-gradient(145deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.05) 100%)",
        "gradient-btn-primary": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        "gradient-btn-secondary": "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
