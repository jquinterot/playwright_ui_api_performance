import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export class AccessibilityFlows {
  static async validatePageAccessibility(page: Page): Promise<void> {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toHaveLength(0);
  }

  static async validateAriaLabels(page: Page): Promise<void> {
    const buttons = page.locator('button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      expect(ariaLabel).not.toBeNull();
    }
  }

  static async validateImageAltTexts(page: Page): Promise<void> {
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const image = images.nth(i);
      const altText = await image.getAttribute('alt');
      expect(altText).not.toBeNull();
    }
  }

  static async validateFormLabels(page: Page): Promise<void> {
    const inputs = page.locator('input');
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const label = page.locator(
        `label[for="${await input.getAttribute('id')}"]`,
      );
      expect(await label.count()).toBeGreaterThan(0);
    }
  }
}
