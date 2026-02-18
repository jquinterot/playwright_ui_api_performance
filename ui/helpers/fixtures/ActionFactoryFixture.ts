import { test as base } from '@playwright/test';
import { ActionFactory } from '@actions/ActionsFactory';

// Declare the types of your fixtures.
type ActionFactoryFixture = {
  actionFactory: ActionFactory;
};

// Extend base test by providing "actionFactory".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<ActionFactoryFixture>({
  actionFactory: async ({ page }, use) => {
    // Set up the fixture.
    const actionFactory = new ActionFactory(page);

    await use(actionFactory);
  },
});

export { expect } from '@playwright/test';
