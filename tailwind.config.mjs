/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        text: {
          DEFAULT: 'var(--text)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        content: '780px',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--text-secondary)',
            a: { color: 'var(--text)', textDecorationColor: 'var(--border)' },
            'a:hover': { color: 'var(--accent)' },
            strong: { color: 'var(--text)' },
            h2: { color: 'var(--text)' },
            h3: { color: 'var(--text)' },
            blockquote: { borderLeftColor: 'var(--accent)', color: 'var(--text-muted)' },
            code: { color: 'var(--text)', backgroundColor: 'var(--surface)' },
            'thead th': { color: 'var(--text-muted)' },
            'tbody td': { borderBottomColor: 'var(--border)' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
