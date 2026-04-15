/**
 * MCP Exploration Tests
 *
 * These tests demonstrate MCP (Model Context Protocol) capabilities
 * where an AI agent can command Playwright to perform actions.
 *
 * Use cases for AI agents:
 * - "Take a screenshot of the homepage"
 * - "Check if the login form has all required fields"
 * - "Click the first product and verify the price"
 * - "Fill out the contact form and submit"
 */

import { test, expect, Page } from '@playwright/test';

test.describe.skip('@mcp Exploration - Screenshot Capabilities', () => {
  test('AI can take full page screenshot', async ({ page }) => {
    await page.goto('https://www.demoblaze.com');
    await page.screenshot({
      fullPage: true,
      path: './screenshots/homepage-full.png',
    });
  });

  test('AI can take element screenshot', async ({ page }) => {
    await page.goto('https://www.demoblaze.com');
    const navbar = page.locator('.navbar');
    await navbar.screenshot({ path: './screenshots/navbar.png' });
  });

  test('AI can capture screenshot on interaction', async ({ page }) => {
    await page.goto('https://www.demoblaze.com');
    await page.click('#login2');
    await page.screenshot({ path: './screenshots/login-modal.png' });
  });
});

test.describe.skip('@mcp Exploration - DOM Inspection', () => {
  test('AI can inspect element attributes', async ({ page }) => {
    await page.goto('https://www.demoblaze.com');

    const loginBtn = page.locator('#login2');
    const attributes = await loginBtn.evaluate((el) => ({
      id: el.id,
      className: el.className,
      text: el.textContent,
      tagName: el.tagName,
    }));

    console.log('Login button attributes:', attributes);
    expect(attributes.id).toBe('login2');
  });

  test('AI can count elements', async ({ page }) => {
    await page.goto('https://www.demoblaze.com');
    await page.click('text=Phones');

    const productCount = await page.locator('.card').count();
    console.log(`Found ${productCount} products`);
    expect(productCount).toBeGreaterThan(0);
  });

  test('AI can extract page structure', async ({ page }) => {
    await page.goto('https://www.demoblaze.com');

    const structure = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a')).map((a) => ({
        href: a.href,
        text: a.textContent?.trim(),
      }));
      const buttons = Array.from(document.querySelectorAll('button')).map(
        (b) => ({
          id: b.id,
          text: b.textContent?.trim(),
        }),
      );
      return { links, buttons };
    });

    console.log('Page links:', structure.links.length);
    console.log('Page buttons:', structure.buttons.length);
  });
});

test.describe.skip('@mcp Exploration - Form Interactions', () => {
  test('AI can fill and submit contact form', async ({ page }) => {
    await page.goto('https://www.demoblaze.com');

    await page.click('#contactus');
    await page.fill('#recipient-email', 'test@example.com');
    await page.fill('#recipient-name', 'Test User');
    await page.fill('#message-text', 'This was filled by AI agent via MCP');

    await page.click('button:text("Send message")');
    page.on('dialog', (d) => d.accept());
  });

  test('AI can login with credentials', async ({ page }) => {
    await page.goto('https://www.demoblaze.com');

    await page.click('#login2');
    await page.fill('#loginusername', 'testuser');
    await page.fill('#loginpassword', 'testpass');
    await page.click('button:text("Log in")');

    page.on('dialog', (d) => d.accept());
  });
});

test.describe.skip('@mcp Exploration - Navigation Flows', () => {
  test('AI can navigate categories', async ({ page }) => {
    await page.goto('https://www.demoblaze.com');

    await page.click('text=Phones');
    await expect(page.locator('.card').first()).toBeVisible();

    await page.click('text=Laptops');
    await expect(page.locator('.card').first()).toBeVisible();
  });

  test('AI can add product to cart', async ({ page }) => {
    await page.goto('https://www.demoblaze.com');

    await page.click('text=Phones');
    await page.click('.card:first-child');
    await page.click('text=Add to cart');

    page.on('dialog', async (d) => await d.accept());

    await expect(page.locator('#cartur')).toBeVisible();
  });
});
