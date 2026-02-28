import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { testConfig } from '@helpers/config/TestConfig';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export default defineConfig({
  testDir: './tests',
  tsconfig: '../tsconfig.json',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: testConfig.retries,
  workers: testConfig.workers,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFileName: 'results.xml' }],
  ],
  use: {
    baseURL: testConfig.baseUrl,
    trace: testConfig.traceOnRetry ? 'on-first-retry' : 'off',
    screenshot: testConfig.screenshotOnFailure ? 'only-on-failure' : 'off',
    video: testConfig.videoOnFailure ? 'retain-on-failure' : 'off',
  },
  expect: {
    timeout: 5000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
