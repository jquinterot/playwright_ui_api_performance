import { test, expect } from '@helpers/fixtures/ActionFactoryFixture';
import { MenuOptions } from '@helpers/enums/MenuOptions';

test.describe('@regression @negative Check login with invalid credentials', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Check login fails with invalid credentials', async ({
    page,
    actionFactory,
  }) => {
    const homeActions = actionFactory.createHomeActions();
    const loginActions = actionFactory.createLoginActions();

    await test.step('When user goes to login', async () => {
      await homeActions.selectMenuOption(MenuOptions.LOG_IN);
      await loginActions.verifyLoginModalVisible();
    });

    await test.step('And enters invalid credentials', async () => {
      await loginActions.fillUsername('invaliduser');
      await loginActions.fillPassword('wrongpassword');
    });

    await test.step('And clicks login button and handles alert', async () => {
      page.on('dialog', async (dialog) => {
        expect(dialog.type()).toBe('alert');
        await dialog.accept();
      });
      await loginActions.clickLogin();
    });

    await test.step('Then user should stay on login modal', async () => {
      await loginActions.verifyLoginModalVisible();
    });
  });
});
