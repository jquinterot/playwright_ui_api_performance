import { test as base } from '@playwright/test';
import { ActionFactory } from '@actions/ActionsFactory';

type ActionFactoryFixture = {
  actionFactory: ActionFactory;
};

export const test = base.extend<ActionFactoryFixture>({
  actionFactory: async ({ page }, use) => {
    const actionFactory = new ActionFactory(page);
    await use(actionFactory);
  },
});

export { expect } from '@playwright/test';
