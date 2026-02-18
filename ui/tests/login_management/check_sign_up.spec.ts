import { test } from '@helpers/fixtures/ActionFactoryFixture';
import { MenuOptions } from '@helpers/enums/MenuOptions';
import { johnInfo } from '@helpers/objects/CustomerInfo';
import { dialogMessages } from '@helpers/objects/DialogMessages';

test.describe('@regression Check Sign up', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Check Sign up', async ({ actionFactory }) => {
    const homeActions = actionFactory.createHomeActions();

    await test.step('When goes to Sign up', async () => {
      await homeActions.selectMenuOption(MenuOptions.SIGN_UP);
    });

    const signupActions = actionFactory.createSingUpActions();

    await test.step('And fills Sign up modal', async () => {
      await signupActions.fillUsername(johnInfo.username);
      await signupActions.fillUserPassword(johnInfo.password);
      await signupActions.selectSignup();
    });

    await test.step('Then dialog message should be correct', async () => {
      await signupActions.checkDialogMessage(dialogMessages.SUCCESSFULL);
    });
  });
});
