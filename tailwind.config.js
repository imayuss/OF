import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** Ported 1:1 from the inline `tailwind.config` in the original index.html. */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      colors: {
        // ── Brand palette: fiery orange / sunshine yellow / jet black / neon green ──
        fiery: '#F04400',
        sun: '#FFD91A',
        jet: '#000000',
        neon: '#D0F030',

        // Material-style tokens used by the components
        primary: {
          DEFAULT: '#F04400',
          // text-safe orange: darker on light surfaces, brighter on black (see src/styles/theme.css)
          ink: 'rgb(var(--primary-ink) / <alpha-value>)',
        },
        'primary-container': '#FFD91A',
        'on-primary': '#000000',
        'on-primary-container': '#4D1700',
        'primary-fixed': '#FFD6C2',
        'primary-fixed-dim': '#FFB894',
        'surface-tint': '#F04400',
        secondary: '#4A6400',
        'secondary-container': '#D0F030',
        'on-secondary': '#FFFFFF',
        'on-secondary-container': '#000000',
        'on-secondary-fixed': '#1F2A00',
        'secondary-fixed-dim': '#B4D400',
        background: '#FFFCEE',
        surface: '#FFFCEE',
        'surface-variant': '#E4E1D2',
        'surface-dim': '#DDDACB',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F4F2EA',
        'surface-container': '#EEEBDF',
        'surface-container-high': '#E9E6D8',
        'surface-container-highest': '#E4E1D2',
        'on-background': '#000000',
        'on-surface': '#000000',
        'on-surface-variant': '#4A4A4A',
        outline: '#7A7A7A',
        tertiary: '#4A4A4A',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        // Tailwind palette overrides so existing orange-* / yellow-* / green-* classes follow the theme
        orange: {
          50: '#FFF1EA', 100: '#FFE0D1', 200: '#FFC2A6', 300: '#FF9A6B', 400: '#FF6A33',
          500: '#F04400', 600: '#D63D00', 700: '#B53300', 800: '#8F2900', 900: '#6B1F00', 950: '#3D1100',
        },
        yellow: {
          50: '#FFFCE5', 100: '#FFF6B8', 200: '#FFEE7A', 300: '#FFE54D', 400: '#FFD91A',
          500: '#F5CC00', 600: '#A88400', 700: '#7A5F00', 800: '#594500', 900: '#3D3000', 950: '#241C00',
        },
        amber: {
          50: '#FFFCE5', 100: '#FFF6B8', 200: '#FFEE7A', 300: '#FFE54D', 400: '#FFD91A',
          500: '#F5CC00', 600: '#A88400', 700: '#7A5F00', 800: '#594500', 900: '#3D3000', 950: '#241C00',
        },
        green: {
          50: '#F8FDE3', 100: '#EEFAB8', 200: '#E1F58A', 300: '#D0F030', 400: '#BEE018',
          500: '#86AA00', 600: '#5E7D00', 700: '#4A6400', 800: '#384B00', 900: '#283500', 950: '#161D00',
        },
        emerald: {
          50: '#F8FDE3', 100: '#EEFAB8', 200: '#E1F58A', 300: '#D0F030', 400: '#BEE018',
          500: '#86AA00', 600: '#5E7D00', 700: '#4A6400', 800: '#384B00', 900: '#283500', 950: '#161D00',
        },
      },
      fontFamily: {
        headline: ['Plus Jakarta Sans'],
        body: ['Plus Jakarta Sans'],
        label: ['Space Grotesk'],
        mono: ['Fira Code'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [forms, containerQueries],
};
