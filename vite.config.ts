import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    // One HTML page per route; S3 serves each as a plain file
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about.html',
        contact: 'contact.html',
      },
    },
  },
  test: {
    include: ['tests/**/*.test.{ts,tsx,mjs}'],
    setupFiles: ['tests/setup.ts'],
    // Enforced by npm test (see CODING_STANDARDS.md); entry points only mount
    // a page, so they're left out
    coverage: {
      include: ['src/**'],
      exclude: ['src/pages/*/main.tsx'],
      reporter: ['text-summary'],
      thresholds: { lines: 85, statements: 85, functions: 85, branches: 85 },
    },
  },
})
