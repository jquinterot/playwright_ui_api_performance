import { test } from '@helpers/fixtures/ActionFactoryFixture';
import { MenuOptions } from '@helpers/enums/MenuOptions';

test.describe('@regression Check login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Check login with valid credentials', async ({ actionFactory }) => {
    const homeActions = actionFactory.createHomeActions();

    await test.step('When goes to login', async () => {
      await homeActions.selectMenuOption(MenuOptions.LOG_IN);
    });
  });
});
