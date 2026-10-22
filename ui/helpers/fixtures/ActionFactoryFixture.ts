import { ActionFactory } from '@actions/ActionsFactory';
import { ShoppingFlow } from '@flows/ShoppingFlow';
import { test as safe } from '@helpers/fixtures/SafeTestFixture';

/**
 * Chained fixtures (composition over inheritance).
 *
 * `SafeTestFixture` overrides `page` with routing + safety handlers. Every
 * fixture chain extending it now gets that behavior automatically — previously
 * SafeTestFixture existed but nothing extended it, so it never ran.
 */
type ActionFactoryFixture = {
  actionFactory: ActionFactory;
  shoppingFlow: ShoppingFlow;
};

export const test = safe.extend<ActionFactoryFixture>({
  actionFactory: async ({ page }, use) => {
    const actionFactory = new ActionFactory(page);
    await use(actionFactory);
  },

  // Instance-based flows are wired like any other fixture, so specs never
  // instantiate orchestration classes themselves (see ShoppingFlow).
  shoppingFlow: async ({ page }, use) => {
    const shoppingFlow = new ShoppingFlow(page);
    await use(shoppingFlow);
  },
});

export { expect } from '@playwright/test';
