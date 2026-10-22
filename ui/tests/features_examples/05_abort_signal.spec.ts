import { expect, test } from '@helpers/fixtures/ActionFactoryFixture';

/**
 * NEW IN 1.62 — AbortSignal cancellation
 * (@docs/api/class-page#page-route — `signal` option across actions/assertions)
 *
 * Most operations and web-first assertions now accept `signal` — an
 * AbortSignal that cancels long-running actions, navigations, waits and even
 * ASSERTIONS. This is the strict, typed successor to "wrap it in Promise.race".
 *
 * Rule of thumb: pass a signal when the deadline is OWNED BY THE TEST (a
 * test-level watchdog). Keep `timeout` for the per-op budget.
 * NB: providing a signal does NOT disable the default timeout — pass
 * `timeout: 0` explicitly when the signal must be the only cancel condition.
 */
test.describe('@learning AbortSignal (1.62)', () => {
  test('a watchdog signal cancels a stale assertion fast', async ({ page }) => {
    await page.goto('');

    // The element this assertion targets will never appear, so without a
    // signal this burns the whole per-op timeout on a doomed expectation.
    const controller = new AbortController();
    // Production-grade alternative: `signal: AbortSignal.timeout(1_500)`
    const watchdog = setTimeout(() => controller.abort(), 1_500);

    const startedAt = Date.now();
    let thrown: unknown;
    try {
      await expect(page.locator('#never-appears')).toBeVisible({
        signal: controller.signal,
        // Make the SIGNAL the only realistic cancel condition.
        timeout: 30_000,
      });
    } catch (error) {
      thrown = error;
    }
    clearTimeout(watchdog);

    const elapsed = Date.now() - startedAt;

    // The assertion was cancelled by the signal after ~1.5s, far before the
    // 30s timeout could have fired. The exact error text is not part of the
    // stability contract — the ELAPSED TIME is the proof of cancellation.
    expect(thrown, 'assertion must throw when aborted').toBeDefined();
    expect(elapsed, 'abort must be near-instant, not a timeout').toBeLessThan(
      10_000,
    );
  });

  test('signals never interfere with a healthy (fast) action', async ({
    page,
  }) => {
    await page.goto('');

    // A generous watchdog that will not fire before the click completes.
    const controller = new AbortController();
    const watchdog = setTimeout(() => controller.abort(), 5_000);

    await page.getByRole('link', { name: 'Log in' }).click({
      signal: controller.signal,
      timeout: 0, // signal must be the only cancel condition here
    });
    clearTimeout(watchdog);

    // The click finished normally — the modal opens as always.
    await expect(page.locator('#logInModal .modal-title')).toBeVisible();
  });
});
