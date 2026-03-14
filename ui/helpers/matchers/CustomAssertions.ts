import { Locator, expect } from '@playwright/test';

export class CustomAssertions {
  static async toHavePrice(
    locator: Locator,
    expectedPrice: string,
  ): Promise<void> {
    const elements = locator.first ? await locator.all() : [locator];
    for (const el of elements) {
      const text = await el.textContent();
      if (text?.includes(expectedPrice)) {
        return;
      }
    }
    throw new Error(`Expected price "${expectedPrice}" not found`);
  }

  static async toBeProductName(
    locator: Locator,
    expectedName: string,
  ): Promise<void> {
    await expect(locator).toHaveText(expectedName);
  }

  static async toContainPrice(
    locator: Locator,
    expectedPrice: string,
  ): Promise<void> {
    const text = await locator.textContent();
    if (!text?.includes(expectedPrice)) {
      throw new Error(
        `Expected price "${expectedPrice}" not found in "${text}"`,
      );
    }
  }

  static async toBeVisibleWithTimeout(
    locator: Locator,
    timeout: number = 10000,
  ): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  static async toContainText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text);
  }
}
