import { test } from '@helpers/fixtures/ActionFactoryFixture';
import { MenuOptions } from '@helpers/enums/MenuOptions';

test.describe('@regression @negative Check login with invalid credentials', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Check login fails with invalid credentials', async ({
    actionFactory,
  }) => {
    const homeActions = actionFactory.createHomeActions();
    const loginActions = actionFactory.createLoginActions();

    await test.step('When user goes to login', async () => {
      await homeActions.selectMenuOption(MenuOptions.LOG_IN);
    });

    await test.step('And enters invalid credentials', async () => {
      await loginActions.fillUsername('invaliduser');
      await loginActions.fillPassword('wrongpassword');
    });

    await test.step('And clicks login button', async () => {
      await loginActions.clickLogin();
    });
  });
});
