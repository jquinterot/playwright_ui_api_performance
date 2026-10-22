import fs from 'fs';
import path from 'path';
import { expect, test } from '@helpers/fixtures/ActionFactoryFixture';

/**
 * NEW IN 1.62 — WebP screenshots
 * (@docs/test-snapshots and pagination)
 *
 * - Standalone screenshots: page.screenshot({ type: 'webp', quality }) —
 *   quality 100 (default) is LOSSLESS, lower values are lossy.
 * - Visual comparisons: hand your golden snapshot a `.webp` name and
 *   expect(page).toHaveScreenshot('home.webp') stores it as lossless WebP.
 * - Config-level default (see playwright.config.ts docs):
 *     expect: { toHaveScreenshot: { type: 'webp' } }
 *
 * Why care? Visual suites with hundreds of PNG baselines shrink ~70-80% vs.
 * PNG and report pages load faster.
 */
test.describe('@learning WebP screenshots (1.62)', () => {
  test('store artifacts as WebP — even lossy', async ({ page }) => {
    await page.goto('');

    const webpPath = path.join('screenshots', 'webp-demo.webp');
    await page.screenshot({ path: webpPath, type: 'webp', quality: 50 });

    expect(fs.existsSync(webpPath), 'WebP artifact was written').toBe(true);

    // Baselines work the same way — the ONLY change is the file extension:
    //   await expect(page).toHaveScreenshot('home-page.webp');
    // (enable once with npx playwright test --update-snapshots, as usual)
  });

  test('WebP also applies to locator screenshots & toHaveScreenshot config', async ({
    page,
  }) => {
    await page.goto('');

    const navbarPath = path.join('screenshots', 'navbar-demo.webp');
    await page.locator('.navbar').screenshot({
      path: navbarPath,
      type: 'webp',
    }); // no quality => lossless WebP

    expect(fs.existsSync(navbarPath)).toBe(true);
  });
});
