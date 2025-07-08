import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    headless: false,             // set to true in CI
    trace: 'on',                 // enable trace viewer
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
