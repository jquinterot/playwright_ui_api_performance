import { test } from '@helpers/fixtures/ActionFactoryFixture';
import { MenuOptions } from '@helpers/enums/MenuOptions';

test.describe('@regression @positive Check contact is working properly', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Check a message can be sent via contact form', async ({
    actionFactory,
  }) => {
    const homeActions = actionFactory.createHomeActions();
    const contactActions = actionFactory.createContactActions();

    await test.step('When user goes to contact', async () => {
      await homeActions.selectMenuOption(MenuOptions.CONTACT);
    });

    await test.step('And contact modal is visible', async () => {
      await contactActions.verifyContactModalVisible();
    });

    await test.step('And fills contact form', async () => {
      await contactActions.fillContactForm(
        'test@example.com',
        'Test User',
        'This is a test message',
      );
    });

    await test.step('And sends the message', async () => {
      await contactActions.sendMessage();
    });
  });
});
