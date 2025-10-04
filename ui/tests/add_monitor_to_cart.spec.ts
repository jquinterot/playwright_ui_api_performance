import { test, expect } from '@playwright/test';

test('Add a monitor to the cart and navigate to the cart page', async ({ page }) => {
  // Navigate to the Demoblaze website
  await page.goto('https://www.demoblaze.com/');

  // Click on the Monitors category
  await page.getByRole('link', { name: 'Monitors' }).click();

  // Wait for the monitors to load and click on the ASUS Full HD monitor
  await page.getByRole('link', { name: 'ASUS Full HD' }).click();

  // Add the monitor to the cart
  await page.getByRole('link', { name: 'Add to cart' }).click();

  // Wait for the alert and accept it
  await page.waitForEvent('dialog').then(dialog => dialog.accept());

  // Navigate to the cart page
  await page.getByRole('link', { name: 'Cart', exact: true }).click();

  // Verify that the cart page is displayed
  await expect(page).toHaveURL(/cart.html/);

  // Verify that the monitor is in the cart
  const cartItem = await page.getByRole('cell', { name: 'ASUS Full HD' });
  expect(cartItem).not.toBeNull();
});