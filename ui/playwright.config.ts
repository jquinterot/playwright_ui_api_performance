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

  // NEW in 1.62 — retryStrategy: 'isolated'.
  // Retry attempts run at the END of the run, one at a time, instead of as soon
  // as a worker is free. This prevents flaky retries from interfering with the
  // clean parallel run (and makes the HTML report easier to reason about).
  retryStrategy: 'isolated',

  workers: testConfig.workers,
  reporter: [
    // NEW in 1.62 — `mergeFiles: true` writes a single self-contained HTML report,
    // which is friendlier for CI artifacts and sharing (no per-run chunks).
    ['html', { outputFolder: 'playwright-report', mergeFiles: true }],
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
      // NEW in 1.64 — `screen` is now forwarded from device descriptors.
      // We opt out so media queries / window.screen behave exactly like pre-1.64
      // runs and visual baselines stay deterministic. Remove this line to adopt
      // the more realistic (emulated full-screen) behavior.
      use: { ...devices['Desktop Chrome'], screen: undefined },
      // Specs under tests/features_examples/authenticated need a logged-in
      // session, so they are excluded from the anonymous project and run in
      // `chromium-authenticated` below.
      testIgnore: '**/authenticated/**',
    },

    // ────────────────────────────────────────────────────────────────────────
    // Official storageState authentication pattern (@docs/auth):
    // 1. `setup` logs in once via the UI and saves cookies/localStorage.
    // 2. `chromium-authenticated` reuses that state in EVERY test — no login
    //    step, no duplicated credentials, faster and less flaky runs.
    // ────────────────────────────────────────────────────────────────────────
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
    },
    {
      name: 'chromium-authenticated',
      testMatch: '**/authenticated/**',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        screen: undefined,
        storageState: path.join(__dirname, '.auth', 'user.json'),
      },
    },
  ],
});
