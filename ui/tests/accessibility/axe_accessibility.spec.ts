import { test } from '@playwright/test';
import { AccessibilityFlows } from '@flows/AccessibilityFlows';

test('@accessibility Check Demoblaze Home Page has correct accessibility', async ({
  page,
}) => {
  await page.goto('');
  await AccessibilityFlows.validatePageAccessibility(page);
});
