import { test } from '../../../helpers/fixtures/ActionFactoryFixture';
import { Monitors } from '../../../helpers/enums/Monitors/Monitors';
import { MonitorPrices } from '../../../helpers/enums/Monitors/MonitorPrices';
import { MenuOptions } from '../../../helpers/enums/MenuOptions';
import { CartFlows } from '../../../helpers/flows/CartFlows';

test.describe('@regression @Order @Monitor Add ASUS Full HD to cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Check that an ASUS Full HD monitor can be added', async ({
    actionFactory,
  }) => {
    const homeActions = actionFactory.createHomeActions();

    await test.step('Given product is added to cart', async () => {
      await CartFlows.addMonitorToCart(
        actionFactory,
        Monitors.ASUS_FULL_HD,
        MonitorPrices.ASUS_FULL_HD_PRICE,
      );
    });

    await test.step('And goes to cart', async () => {
      await homeActions.selectMenuOption(MenuOptions.CART);
    });

    const cartActions = actionFactory.createCartActions();

    await test.step('Then the ASUS Full HD monitor is added to cart', async () => {
      await cartActions.checkProductIsDisplayed(Monitors.ASUS_FULL_HD);
    });

    await test.step('And the ASUS Full HD monitor is deleted', async () => {
      await cartActions.deleteProductFromCard(Monitors.ASUS_FULL_HD);
    });
  });
});

// TODO (stability/refactor):
// - Use case-insensitive role locators: when checking cart items prefer `getByRole('cell', { name: /ASUS Full HD/i })` so small label changes don't break tests.
// - Assert product price with a tolerant matcher (regex or `toContainText`) because UI adds suffixes like "*includes tax".
// - Consider extracting the add->gotoCart->verify pattern into a single `CartFlows.addAndVerifyMonitor(product)` helper to reduce repetition.