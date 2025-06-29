import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    environment: 'node',
    environmentMatchGlobs: [
      ['**/app/**', 'jsdom'],
      ['**/*.spec.tsx', 'jsdom'],
    ],
    setupFiles: ['./test/setup.ts'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
})
