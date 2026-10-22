import { expect, test } from '@helpers/fixtures/ActionFactoryFixture';

/**
 * NEW IN 1.63 — Step params and subtitles  (@docs/api/class-test#test-step)
 *
 * test.step() now carries STRUCTURED DATA for reporters:
 *   - subtitle: a short human qualifier ("as admin")
 *   - params:   machine-readable payload for custom reporters
 *
 * Both render next to the step title in the trace viewer and the HTML report.
 * Playwright's own API steps also report their locator/url — e.g. a `Click`
 * step shows subtitle `getByRole('button')` — so YOUR steps finally match
 * that level of detail.
 *
 * See it in: npx playwright show-report  (from ui/)
 */
test.describe('@learning Step metadata (1.63)', () => {
  test('checkout steps report who/how they act', async ({ shoppingFlow }) => {
    await shoppingFlow.openStore();

    await test.step(
      'Given the store is open',
      async () => {
        await expect(shoppingFlow.getPage().locator('.navbar')).toBeVisible();
      },
      { subtitle: 'anonymous visitor', params: { site: 'demoblaze.com' } },
    );

    await test.step(
      'When the visitor logs in',
      async () => {
        // Self-provision: demoblaze's shared demo account no longer works,
        // so every run gets its own brand-new user (test data lifecycle).
        await shoppingFlow.signUpAndLogin();
      },
      // Never put secrets in params — use the role, not the password.
      { subtitle: 'freshly provisioned user', params: { role: 'demo-user' } },
    );

    await test.step(
      'Then the session cookie exists',
      async () => {
        const cookies = await shoppingFlow.getPage().context().cookies();
        expect(cookies.find((c) => c.name === 'tokenp_')).toBeTruthy();
      },
      { subtitle: 'tokenp_ cookie', params: { storage: 'cookie' } },
    );
  });
});
