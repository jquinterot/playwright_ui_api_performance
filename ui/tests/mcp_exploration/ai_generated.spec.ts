import { test, expect } from '@playwright/test';

/**
 * AI-Generated Tests via MCP
 *
 * These tests are discovered by AI agents using the MCP server and
 * validated by human engineers. They demonstrate the power of AI-driven
 * test discovery.
 *
 * MCP Workflow:
 * 1. AI navigates to page using browser_navigate
 * 2. AI captures Aria snapshot using browser_snapshot
 * 3. AI identifies testable elements and patterns
 * 4. AI generates Playwright test code
 * 5. Human reviews, refines, and commits
 *
 * To run with MCP:
 *   npm run mcp:start
 *   npm run ui:mcp
 */

test.describe('@mcp @ai-generated AI Discovered Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('AI-discovered: Product images exist', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();

    expect(count).toBeGreaterThan(0);
    console.log(`Found ${count} images on the page`);
  });

  test('AI-discovered: All interactive elements are reachable', async ({ page }) => {
    const snapshot = await page.ariaSnapshot();

    // AI identified these critical elements from the Aria snapshot
    // Note: The website uses 'Home (current)' for the active page
    expect(snapshot).toContain('link "Home');
    expect(snapshot).toContain('link "Contact"');
    expect(snapshot).toContain('link "About us"');
    expect(snapshot).toContain('link "Cart"');
    expect(snapshot).toContain('link "Log in"');
    expect(snapshot).toContain('link "Sign up"');
  });

  test('AI-discovered: Product cards have price and title', async ({ page }) => {
    // Wait for product cards to load dynamically
    const cards = page.locator('#tbodyid .card');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });

    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 3); i++) {
      const card = cards.nth(i);
      const title = card.locator('.card-title');
      const price = card.locator('h5');

      await expect(title).toBeVisible();
      await expect(price).toBeVisible();
    }
  });

  test('AI-discovered: Navigation links are valid', async ({ page }) => {
    const links = page.locator('.navbar a');
    const count = await links.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('AI-discovered: Modal opens on login click', async ({ page }) => {
    await page.click('#login2');

    const modal = page.locator('#logInModal');
    await expect(modal).toBeVisible();

    // Check that the modal has input fields
    const usernameInput = modal.locator('#loginusername');
    const passwordInput = modal.locator('#loginpassword');
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('AI-discovered: Page has navigation landmark', async ({ page }) => {
    const snapshot = await page.ariaSnapshot();

    // Check for navigation landmark
    expect(snapshot).toContain('navigation');

    // Check for contentinfo (footer)
    expect(snapshot).toContain('contentinfo');
  });

  test('AI-discovered: Product categories are accessible links', async ({ page }) => {
    const categories = ['Phones', 'Laptops', 'Monitors'];

    for (const category of categories) {
      const link = page.getByRole('link', { name: category });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', '#');
    }
  });

  test('AI-discovered: Add to cart button triggers alert', async ({ page }) => {
    await page.goto('');
    await page.click('text=Phones');
    await page.click('.card:first-child a');

    // Set up dialog handler before clicking add to cart
    const dialogPromise = page.waitForEvent('dialog');
    await page.click('text=Add to cart');

    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('Product added');
    await dialog.accept();
  });
});
