import { defineConfig, devices } from '@playwright/test';

const profiles = [
  { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], browserName: 'chromium', viewport: { width: 1440, height: 1000 } } },
  { name: 'mobile-chromium', use: { ...devices['Pixel 7'], browserName: 'chromium', viewport: { width: 375, height: 812 } } },
  { name: 'mobile-webkit', use: { ...devices['iPhone 13'], browserName: 'webkit', viewport: { width: 375, height: 812 } } },
];

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 2,
  timeout: 30_000,
  globalTimeout: 10 * 60_000,
  expect: { timeout: 5_000 },
  reporter: [['line'], ['html', { open: 'never' }]],
  outputDir: 'test-results',
  use: {
    baseURL: 'http://127.0.0.1:4175',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: profiles.flatMap(profile => ['light', 'dark'].map(colorScheme => ({
    name: `${profile.name}-${colorScheme}`,
    use: { ...profile.use, colorScheme },
  }))),
  webServer: {
    command: 'node scripts/serve.mjs --audit',
    env: { PORT: '4175' },
    url: 'http://127.0.0.1:4175',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
