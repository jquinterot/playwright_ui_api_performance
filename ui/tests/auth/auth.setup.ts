import path from 'path';
import { test as setup, expect } from '@playwright/test';
import { ShoppingFlow, generateTestUser } from '@flows/ShoppingFlow';

/**
 * Auth setup project (official storageState pattern, @docs/auth)
 *
 * Runs once before the `chromium-authenticated` project (see `dependencies`
 * in playwright.config.ts). It creates/uses a REAL login session through the
 * UI, asserts the session actually exists, then saves it so every
 * authenticated test starts already logged in — no login steps, no
 * duplicated credentials, no silent "green" failures.
 *
 * Account strategy (self-provisioning test data):
 * - `DEMOBLAZE_USERNAME` / `DEMOBLAZE_PASSWORD` env vars → log in with YOUR
 *   account (fail fast if they are wrong).
 * - otherwise → register a fresh unique account inside this run. Demoblaze's
 *   shared `testuser` no longer accepts its well-known password, and creating
 *   a per-run user keeps runs deterministic and side-effect free.
 */

// ui/tests/auth/ → ../..  = ui/  → ui/.auth/user.json (matches the project's storageState path)
const authFile = path.join(__dirname, '..', '..', '.auth', 'user.json');

setup('create authenticated session', async ({ page }) => {
  const shoppingFlow = new ShoppingFlow(page);
  await shoppingFlow.openStore();

  let username: string;
  let password: string;
  if (process.env.DEMOBLAZE_USERNAME) {
    username = process.env.DEMOBLAZE_USERNAME;
    password = process.env.DEMOBLAZE_PASSWORD ?? '';
    await shoppingFlow.login(username, password);
  } else {
    const credentials = generateTestUser();
    username = credentials.username;
    password = credentials.password;
    await shoppingFlow.signUpAndLogin(); // provisioning + strict login
  }

  // demoblaze stores the session token in the `tokenp_` cookie. Verifying it
  // here makes bad credentials loud HERE, not 15 tests later.
  const tokenCookie = (await page.context().cookies()).find(
    (cookie) => cookie.name === 'tokenp_',
  );
  expect(tokenCookie, `Login must set the tokenp_ cookie for ${username}`).toBeTruthy();

  await page.context().storageState({ path: authFile });
});
