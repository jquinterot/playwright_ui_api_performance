import { test } from '@playwright/test';
import { AccessibilityFlows } from '@flows/AccessibilityFlows';

test.describe('@accessibility Accessibility Tests', () => {
  test('Validate ARIA roles and labels', async ({ page }) => {
    await page.goto('');
    await AccessibilityFlows.validateAriaLabels(page);
  });

  test('Check alt text for images', async ({ page }) => {
    await page.goto('');
    await AccessibilityFlows.validateImageAltTexts(page);
  });

  test('Ensure form elements have labels', async ({ page }) => {
    await page.goto('');
    await AccessibilityFlows.validateFormLabels(page);
  });
});
