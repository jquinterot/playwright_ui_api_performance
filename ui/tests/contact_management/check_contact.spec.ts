import { test } from '@helpers/fixtures/ActionFactoryFixture';
import { MenuOptions } from '@helpers/enums/MenuOptions';

test.describe('@regression Check contact is working properly', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Check a message can be sent via contact form', async ({
    actionFactory,
  }) => {
    const homeActions = actionFactory.createHomeActions();

    await test.step('When goes to contact', async () => {
      await homeActions.selectMenuOption(MenuOptions.CONTACT);
    });
  });
});
