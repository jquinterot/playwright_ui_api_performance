import { test as base } from '@playwright/test';

/**
 * SafeTestFixture
 *
 * A Playwright 1.60.0 fixture that uses `test.abort()` to prevent tests
 * from accidentally triggering destructive or production actions.
 *
 * New in 1.60.0: test.abort() aborts the currently running test from a
 * fixture, hook, or route handler with an optional message.
 */

export const test = base.extend({
  page: async ({ page }, use) => {
    // Block dangerous endpoints that tests should never access
    const blockedEndpoints = [
      '**/checkout/purchase',
      '**/api/delete-account',
      '**/api/delete-order',
      '**/admin/**',
      '**/settings/delete',
      '**/payment/process',
    ];

    for (const pattern of blockedEndpoints) {
      await page.route(pattern, (route) => {
        test.abort(
          `Tests must not access: ${pattern}. Use mock environment or test data.`,
        );
        return route.abort();
      });
    }

    // Log navigations for debugging
    page.on('framenavigated', (frame) => {
      const url = frame.url();
      if (url.includes('demoblaze.com')) {
        console.log(`[SafeTest] Navigated to: ${url}`);
      } else if (url !== 'about:blank') {
        console.warn(`[SafeTest] Warning: External navigation detected: ${url}`);
      }
    });

    // Monitor for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error(`[SafeTest] Console error: ${msg.text()}`);
      }
    });

    // Monitor for page errors
    page.on('pageerror', (error) => {
      console.error(`[SafeTest] Page error: ${error.message}`);
    });

    await use(page);
  },
});

export { expect } from '@playwright/test';
