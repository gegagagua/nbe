/** @type {import('tailwindcss').Config} */

// Semantic color tokens map to CSS variables defined in src/global.css
// (:root for light, .dark:root for dark). `<alpha-value>` lets utilities like
// `bg-surface/70` work for the Civic Glass translucency.
const withVar = (name) => `rgb(var(${name}) / <alpha-value>)`;

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: withVar("--c-primary"),
          pressed: withVar("--c-primary-pressed"),
          subtle: withVar("--c-primary-subtle"),
        },
        "on-primary": withVar("--c-on-primary"),
        accent: {
          DEFAULT: withVar("--c-accent"),
          pressed: withVar("--c-accent-pressed"),
          subtle: withVar("--c-accent-subtle"),
        },
        "on-accent": withVar("--c-on-accent"),
        danger: {
          DEFAULT: withVar("--c-danger"),
          pressed: withVar("--c-danger-pressed"),
          subtle: withVar("--c-danger-subtle"),
        },
        "on-danger": withVar("--c-on-danger"),
        success: {
          DEFAULT: withVar("--c-success"),
          subtle: withVar("--c-success-subtle"),
        },
        "on-success": withVar("--c-on-success"),
        warning: {
          DEFAULT: withVar("--c-warning"),
          subtle: withVar("--c-warning-subtle"),
        },
        "on-warning": withVar("--c-on-warning"),

        bg: withVar("--c-bg"),
        surface: {
          DEFAULT: withVar("--c-surface"),
          elevated: withVar("--c-surface-elevated"),
          sunken: withVar("--c-surface-sunken"),
          pressed: withVar("--c-surface-pressed"),
        },

        fg: {
          DEFAULT: withVar("--c-fg"),
          secondary: withVar("--c-fg-secondary"),
          muted: withVar("--c-fg-muted"),
          inverse: withVar("--c-fg-inverse"),
          disabled: withVar("--c-fg-disabled"),
        },

        border: {
          DEFAULT: withVar("--c-border"),
          strong: withVar("--c-border-strong"),
          focus: withVar("--c-accent"),
        },

        input: {
          DEFAULT: withVar("--c-input-bg"),
          border: withVar("--c-input-border"),
          placeholder: withVar("--c-input-placeholder"),
        },

        skeleton: withVar("--c-skeleton"),
      },

      fontSize: {
        caption: ["11px", "15px"],
        label: ["13px", "18px"],
        body: ["15px", "23px"],
        "body-lg": ["16px", "24px"],
        subtitle: ["16px", "22px"],
        heading: ["18px", "24px"],
        title: ["22px", "28px"],
        display: ["30px", "36px"],
        hero: ["32px", "38px"],
      },

      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "28px",
        "3xl": "36px",
        full: "9999px",
      },

      spacing: {
        // Tailwind's default scale is already the 4/8 grid (1=4px, 2=8, 4=16…).
        // A couple of app-specific insets:
        "tab-bar": "96px",
        "safe-cta": "34px",
      },
    },
  },
  plugins: [],
};
