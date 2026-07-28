import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        drama: ['"Playfair Display"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
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
        navy: {
          DEFAULT: "hsl(var(--navy))",
          light: "hsl(var(--navy-light))",
          dark: "hsl(var(--navy-dark))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          elevated: "hsl(var(--surface-elevated))",
        },
        /* ── Sistema (QG + Portal): linguagem "Prancha Técnica" ──────────────
           Definidos em src/styles/sistema.css sob a classe `.sys`, então só
           valem dentro dos layouts logados. Canais RGB para que `/opacidade`
           funcione (ex.: `bg-sys-accent/10`). Nada acima foi alterado — o site
           institucional continua exatamente como estava. */
        sys: {
          paper: "rgb(var(--sys-paper) / <alpha-value>)",
          raised: "rgb(var(--sys-raised) / <alpha-value>)",
          ink: "rgb(var(--sys-ink) / <alpha-value>)",
          "ink-2": "rgb(var(--sys-ink-2) / <alpha-value>)",
          "ink-3": "rgb(var(--sys-ink-3) / <alpha-value>)",
          rule: "rgb(var(--sys-rule) / <alpha-value>)",
          "rule-strong": "rgb(var(--sys-rule-strong) / <alpha-value>)",
          accent: "rgb(var(--sys-accent) / <alpha-value>)",
          ochre: "rgb(var(--sys-ochre) / <alpha-value>)",
          danger: "rgb(var(--sys-danger) / <alpha-value>)",
          ok: "rgb(var(--sys-ok) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "2rem",
        md: "1.5rem",
        sm: "1rem",
        sys: "var(--sys-radius)",
      },
      boxShadow: {
        sys: "var(--sys-shadow)",
      },
      letterSpacing: {
        tecnico: "0.18em",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
