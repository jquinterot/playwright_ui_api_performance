import { test } from '@helpers/fixtures/ActionFactoryFixture';

test.describe('@acceptance Check Poke is correctly displayed', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Check Demoblaze Home Page title should be displayed', async ({
    page,
    actionFactory,
  }) => {
    const homeActions = actionFactory.createHomeActions();
    await homeActions.checkHomePageTitle(page);
  });

  test('Check Demoblaze Home Page bar title is correct', async ({
    actionFactory,
  }) => {
    const homeActions = actionFactory.createHomeActions();
    await homeActions.verifyHomePageNavbarTitle();
  });
});
