import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/tests/**/*.{test,spec}.ts', 'src/tests/**/*.{test,spec}.tsx'],
    coverage: {
      provider: 'v8',
      all: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}', 'test/**/*.d.ts'],
      reporter: ['text'],
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
})
