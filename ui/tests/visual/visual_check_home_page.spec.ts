import { test, expect } from '@helpers/fixtures/ActionFactoryFixture';

test.describe.skip(
  '@visual Check Demoblaze home page is successfully displayed',
  () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('');
    });

    test('Check Demoblaze home page screenshot is correct', async ({
      page,
    }) => {
      await expect(page).toHaveScreenshot('home-page.png');
    });
  },
);
