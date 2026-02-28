import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@accessibility Check Demoblaze Home Page has correct accessibility', async ({
  page,
}) => {
  await page.goto('');

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toHaveLength(0);
});
