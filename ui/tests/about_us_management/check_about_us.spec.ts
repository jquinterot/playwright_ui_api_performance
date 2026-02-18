import { test } from '@helpers/fixtures/ActionFactoryFixture';
import { MenuOptions } from '@helpers/enums/MenuOptions';

test.describe('@regression Check About us', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Check About us is correctly displayed', async ({ actionFactory }) => {
    const homeActions = actionFactory.createHomeActions();
    const AboutUsActions = actionFactory.createAboutUsActions();

    await test.step('When goes to About us', async () => {
      await homeActions.selectMenuOption(MenuOptions.ABOUT_US);
    });

    await test.step('Then About us title is displayed', async () => {
      await AboutUsActions.isAboutUsTitleDisplayed();
    });

    await test.step('And the modal is closed', async () => {
      await AboutUsActions.closeModal();
    });
  });
});
