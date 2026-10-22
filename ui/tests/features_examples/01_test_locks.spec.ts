import { expect, test } from '@helpers/fixtures/ActionFactoryFixture';

/**
 * NEW IN 1.63 — Test locks  (@docs/test-parallel#test-locks)
 *
 * Tests that touch a SHARED resource (an account, a global setting, a shared
 * cart) can declare a named `lock`. Tests sharing a lock name never run
 * concurrently — across files, workers and projects — while everything else
 * keeps running in parallel.
 *
 * This replaces the usual tricks: serializing whole suites, `fullyParallel:
 * false`, or hoping your tests don't collide.
 *
 * Run it and watch the workers: the two tests below can never overlap, even
 * with `--workers=4 && fullyParallel`:
 *   npx @playwright/test test tests/features_examples/01_test_locks.spec.ts --workers=4
 */
test.describe('@learning @lock New in 1.63: test locks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  // Both tests "use" the same shared resource — on demoblaze that is one demo
  // account / cart state. The lock name is arbitrary; what matters is BOTH
  // tests declare the SAME name so the runner serializes exactly these tests.
  test(
    'holds lock: shared demoblaze account (A)',
    { lock: 'demoblaze-account' },
    async ({ page }) => {
      await expect(page).toHaveTitle(/STORE/);
    },
  );

  test(
    'holds the same lock: shared demoblaze account (B) — never overlaps A',
    { lock: 'demoblaze-account' },
    async ({ page }) => {
      await expect(page.locator('.navbar')).toBeVisible();
    },
  );

  // A third test declaring a DIFFERENT lock (or none) still runs in full
  // parallel with both of the above — locks are opt-in, per resource.
  test(
    'no lock needed here — logs no shared state',
    async ({ page }) => {
      await expect(page.getByRole('link', { name: 'About us' })).toBeVisible();
    },
  );
});

// Group-level syntax — every test in the group holds the lock:
//   test.describe.configure({ lock: 'demoblaze-account' });
