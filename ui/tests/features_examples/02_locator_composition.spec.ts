import { expect, test } from '@helpers/fixtures/ActionFactoryFixture';

/**
 * Locator composition — the modern way to scope and debug locators.
 *
 * NEW IN 1.64 — locator.within()  (@docs/api/class-locator#locator-within)
 * NEW IN 1.63 — locator.visible() (@docs/api/class-locator#locator-visible)
 */
test.describe('@learning Locator composition (1.63 / 1.64)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('locator.within() composes two locators in natural order (1.64)', async ({
    page,
  }) => {
    const navbar = page.locator('.navbar');
    const loginLink = page.getByRole('link', { name: 'Log in', exact: true });

    // Reads as "this Log in link, within that navbar". The Log in button in
    // the login modal has role=button, so role=link alone is already unique —
    // but the intent ("WHERE on the page") is now part of the locator, which
    // keeps tests readable and future-proof if a second "Log in" link appears.
    await loginLink.within(navbar).click();

    await expect(page.locator('#logInModal .modal-title')).toBeVisible();
  });

  test('within() resolves nth() inside EVERY parent, not the page (1.64)', async ({
    page,
  }) => {
    // Column-STYLE queries: "match relative locators per-parent". With the
    // legacy `.nth()` on a plain locator you only ever got ONE global match.
    // Here: the FIRST nav link inside each <li> — one per list item, resolved
    // within each parent separately.
    const listItems = page.locator('.navbar ul li');
    const firstLinkPerListItem = page
      .getByRole('link')
      .first()
      .within(listItems);

    const count = await firstLinkPerListItem.count();
    expect(count).toBeGreaterThan(0);

    // Compare with the naive global query — exactly one link site-wide:
    const globalFirst = await page.getByRole('link').first().count();
    expect(globalFirst).toBe(1);
  });

  test('locator.visible() replaces the :visible CSS pseudo-class (1.63)', async ({
    page,
  }) => {
    const allLinks = page.getByRole('link');
    const visibleLinks = allLinks.visible();

    const total = await allLinks.count();
    const visible = await visibleLinks.count();

    expect(visible).toBeGreaterThan(0);
    expect(visible).toBeLessThanOrEqual(total);

    // Why this matters: `.visible()` is a locator composition primitive — it
    // keeps auto-waiting semantics with actions/assertions. Legacy approaches
    // were `page.locator('a:visible')` (CSS pseudo, string-only, no chaining)
    // or `expect(await link.isVisible()).toBe(true)` (manual assertion that
    // does not retry — an official anti-pattern).
  });
});
