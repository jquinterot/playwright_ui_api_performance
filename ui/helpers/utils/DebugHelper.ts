import { Page, Locator } from '@playwright/test';

/**
 * DebugHelper
 *
 * Playwright 1.60.0 enhanced highlight utilities:
 * - locator.highlight({ style }) — custom CSS styles
 * - page.hideHighlight() — clear all highlights
 */

export class DebugHelper {
  /**
   * Highlight a single element with a custom style.
   */
  static async highlightElement(
    locator: Locator,
    style: string = 'outline: 3px solid red; background: rgba(255,0,0,0.1);',
  ): Promise<void> {
    await locator.highlight({ style });
  }

  /**
   * Highlight all elements matching a locator with a style.
   */
  static async highlightAll(
    locator: Locator,
    style: string = 'outline: 2px dashed blue; border-radius: 8px;',
  ): Promise<void> {
    const count = await locator.count();
    for (let i = 0; i < count; i++) {
      await locator.nth(i).highlight({ style });
    }
  }

  /**
   * Highlight all product cards on the page.
   */
  static async highlightAllProducts(page: Page): Promise<void> {
    await this.highlightAll(
      page.locator('.card'),
      'outline: 2px dashed blue; border-radius: 8px;',
    );
  }

  /**
   * Highlight all navigation links.
   */
  static async highlightNavigation(page: Page): Promise<void> {
    await this.highlightAll(
      page.locator('.navbar a'),
      'outline: 2px solid green; background: rgba(0,255,0,0.1);',
    );
  }

  /**
   * Highlight interactive elements (buttons, links, inputs).
   */
  static async highlightInteractiveElements(page: Page): Promise<void> {
    await this.highlightAll(
      page.locator('button, a, input, select, textarea'),
      'outline: 2px solid orange; background: rgba(255,165,0,0.1);',
    );
  }

  /**
   * Clear all highlights from the page.
   * New in 1.60.0: page.hideHighlight()
   */
  static async clearAllHighlights(page: Page): Promise<void> {
    await page.hideHighlight();
  }

  /**
   * Highlight and screenshot helper for debugging.
   */
  static async highlightAndScreenshot(
    page: Page,
    locator: Locator,
    path: string,
    style?: string,
  ): Promise<void> {
    await this.highlightElement(locator, style);
    await page.screenshot({ path, fullPage: true });
    await this.clearAllHighlights(page);
  }
}
