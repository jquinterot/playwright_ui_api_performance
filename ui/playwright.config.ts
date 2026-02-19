import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export default defineConfig({
  testDir: './tests',
  tsconfig: '../tsconfig.json',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 4,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFileName: 'results.xml' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.demoblaze.com/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  expect: {
    timeout: 5000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mcp',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        connectOptions: {
          wsEndpoint: 'ws://localhost:63424/',
        },
      },
    },
  ],
});
