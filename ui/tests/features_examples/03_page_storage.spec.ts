import { expect, test } from '@helpers/fixtures/ActionFactoryFixture';

/**
 * NEW IN 1.61 — WebStorage API  (@docs/api/class-webstorage)
 *
 * page.localStorage and page.sessionStorage give first-class read/write
 * access to the page's storage for the CURRENT ORIGIN — no page.evaluate.
 *
 * Note for THIS codebase: demoblaze keeps its session token in the `tokenp_`
 * COOKIE (see ui/tests/auth/auth.setup.ts), not in web storage. So below we
 * use localStorage to store our own marker, and show the cookie read that is
 * the "real" session check here.
 */
test.describe('@learning Page storage APIs (1.61)', () => {
  test('page.localStorage reads and writes the current origin', async ({
    page,
    shoppingFlow,
  }) => {
    await shoppingFlow.openStore();

    // Write / read / list — all awaited, all web-first.
    await page.localStorage.setItem('playwright-learning', 'hello');
    const value = await page.localStorage.getItem('playwright-learning');
    expect(value).toBe('hello');

    const allEntries = await page.localStorage.items();
    expect(
      allEntries.find((entry) => entry.name === 'playwright-learning'),
    ).toBeDefined();

    // Clean up (also demonstrates removes are awaited like everything else)
    await page.localStorage.removeItem('playwright-learning');
    expect(await page.localStorage.getItem('playwright-learning')).toBeNull();
  });

  test('page.sessionStorage + cookie: reading the demoblaze session', async ({
    page,
    shoppingFlow,
  }) => {
    await shoppingFlow.openStore();
    // Provisions a fresh account (the shared demo credentials no longer work)
    // and logs in with it — see ShoppingFlow.signUpAndLogin().
    const credentials = await shoppingFlow.signUpAndLogin();

    // demoblaze stores its AUTH SESSION in the `tokenp_` cookie (verified in
    // its index.js) — so session verification means reading cookies, not web
    // storage. storageState (auth.setup.ts) captures cookies AND web storage.
    const cookies = await page.context().cookies();
    const sessionToken = cookies.find((c) => c.name === 'tokenp_');
    expect(
      sessionToken,
      `session token cookie for ${credentials.username}`,
    ).toBeTruthy();

    // sessionStorage snapshot — typically empty here, but the API is identical:
    const sessionItems = await page.sessionStorage.items();
    expect(Array.isArray(sessionItems)).toBe(true);
  });
});
