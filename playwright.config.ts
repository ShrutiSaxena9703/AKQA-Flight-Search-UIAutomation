import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  timeout: 60_000,
  expect: { timeout: 10_000 },
   reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
  ],
  outputDir: 'reports/test-results',

  use: {
  baseURL: 'https://flights.agoda.com',
  locale: 'en-GB',
  viewport: { width: 1366, height: 768 },
  screenshot: 'only-on-failure',
  trace: 'retain-on-failure',
},
});