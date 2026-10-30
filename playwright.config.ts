import { defineConfig, devices } from '@playwright/test'

// End-to-end tests: the built site in real browsers, for what jsdom can't
// show (CSS, layout, browser behaviour). Run with npm run e2e.
export default defineConfig({
  testDir: 'tests/e2e',
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4173' },
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    // A phone in Chromium, and in WebKit (Safari's engine)
    {
      name: 'phone',
      use: { ...devices['iPhone 13'], browserName: 'chromium' },
    },
    { name: 'safari', use: { ...devices['iPhone 13'] } },
  ],
})
