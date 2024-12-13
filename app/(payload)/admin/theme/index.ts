export const adminTheme = {
  root: {
    '--theme-elevation-0': 'var(--background)',
    '--theme-elevation-50': 'var(--card)',
    '--theme-elevation-100': 'var(--muted)',
    '--theme-elevation-200': 'var(--accent)',
    '--theme-elevation-300': 'var(--secondary)',
    '--theme-elevation-400': 'var(--primary)',
    '--theme-elevation-500': 'var(--primary)',
    '--theme-elevation-1000': 'var(--foreground)',
  },
  colors: {
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    primary: {
      100: 'hsl(var(--primary-100))',
      200: 'hsl(var(--primary-200))',
      300: 'hsl(var(--primary-300))',
      400: 'hsl(var(--primary-400))',
      500: 'hsl(var(--primary-500))',
      600: 'hsl(var(--primary-600))',
    },
    text: {
      primary: 'hsl(var(--text-primary))',
      secondary: 'hsl(var(--text-secondary))',
      disabled: 'hsl(var(--text-disabled))',
    },
    border: 'hsl(var(--border))',
    error: 'hsl(var(--destructive))',
    success: 'hsl(var(--success))',
  },
  typography: {
    font: 'var(--font-sans)',
  },
  shadows: {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
  },
  radii: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
  },
}
