import { test, expect } from '@playwright/test';

test.describe('@accessibility Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Validate ARIA roles and labels', async ({ page }) => {
    const navRole = await page.getByRole('navigation');
    expect(navRole).toBeTruthy();

    const buttons = await page.locator('button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      expect(ariaLabel).not.toBeNull();
    }
  });

  test('Check alt text for images', async ({ page }) => {
    const images = await page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const image = images.nth(i);
      const altText = await image.getAttribute('alt');
      expect(altText).not.toBeNull();
    }
  });

  test('Ensure form elements have labels', async ({ page }) => {
    const inputs = await page.locator('input');
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const label = await page.locator(
        `label[for="${await input.getAttribute('id')}"]`,
      );
      expect(await label.count()).toBeGreaterThan(0);
    }
  });
});
