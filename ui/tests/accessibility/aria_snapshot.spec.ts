import { test, expect } from '@playwright/test';

/**
 * Aria Snapshot Tests
 *
 * Playwright 1.60.0 feature: Aria snapshots provide a native way to validate
 * page accessibility structure and catch regressions.
 *
 * New features used:
 * - expect(page).toMatchAriaSnapshot() — works on Page (new in 1.60.0)
 * - locator.ariaSnapshot({ boxes: true }) — includes bounding boxes for AI
 */

test.describe('@accessibility Aria Snapshot Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Home page matches baseline Aria snapshot', async ({ page }) => {
    const snapshot = await page.ariaSnapshot();
    expect(snapshot).toMatchSnapshot('home-page-aria.txt');
  });

  test('Navigation has correct ARIA structure', async ({ page }) => {
    const navbar = page.locator('.navbar');
    const snapshot = await navbar.ariaSnapshot();
    expect(snapshot).toMatchSnapshot('navbar-aria.txt');
  });

  test('Product cards are accessible', async ({ page }) => {
    await page.click('text=Phones');
    const products = page.locator('.card');
    const snapshot = await products.first().ariaSnapshot();
    expect(snapshot).toMatchSnapshot('product-card-aria.txt');
  });

  test('Aria snapshot with boxes for AI context', async ({ page }) => {
    const snapshot = await page.ariaSnapshot({ boxes: true });

    // Verify structure contains bounding boxes
    expect(snapshot).toContain('[box=');

    // Log for AI analysis
    console.log('Aria snapshot with boxes:', snapshot);
  });

  test('Login modal has correct ARIA structure', async ({ page }) => {
    await page.click('#login2');
    const modal = page.locator('#logInModal');
    const snapshot = await modal.ariaSnapshot();
    expect(snapshot).toMatchSnapshot('login-modal-aria.txt');
  });

  test('Contact modal has correct ARIA structure', async ({ page }) => {
    await page.getByRole('link', { name: 'Contact', exact: true }).click();
    const modal = page.locator('#exampleModal');
    const snapshot = await modal.ariaSnapshot();
    expect(snapshot).toMatchSnapshot('contact-modal-aria.txt');
  });
});
