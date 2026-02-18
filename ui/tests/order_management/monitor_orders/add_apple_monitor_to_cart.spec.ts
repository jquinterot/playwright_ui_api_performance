import { test } from '@helpers/fixtures/ActionFactoryFixture';
import { Monitors } from '@helpers/enums/Monitors/Monitors';
import { MonitorPrices } from '@helpers/enums/Monitors/MonitorPrices';
import { MenuOptions } from '@helpers/enums/MenuOptions';
import { CartFlows } from '@helpers/flows/CartFlows';

test.describe('@regression @Order @Monitor Add Monitor to Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Add a monitor to the cart and navigate to the cart page', async ({
    actionFactory,
  }) => {
    const homeActions = actionFactory.createHomeActions();

    await test.step('Given product is added to cart', async () => {
      await CartFlows.addMonitorToCart(
        actionFactory,
        Monitors.APPLE_MONITOR_24,
        MonitorPrices.APPLE_MONITOR_24_PRICE,
      );
    });

    await test.step('And goes to cart', async () => {
      await homeActions.selectMenuOption(MenuOptions.CART);
      // TODO (readability/flakiness):
      // - Ensure `selectMenuOption(MenuOptions.CART)` waits for navigation/contents; if it doesn't, add an explicit wait-for on the cart page.
    });

    const cartActions = actionFactory.createCartActions();

    await test.step('Then the monitor is displayed in the cart', async () => {
      await cartActions.checkProductIsDisplayed(Monitors.APPLE_MONITOR_24);
      // - When verifying the cart item, prefer `expect(locator).toBeVisible()` with a timeout override only when necessary; otherwise rely on default timeouts and clearer locators.
    });

    // Consider adding an assertion that the cart counter increments to detect missing add-to-cart behavior earlier.
  });
});
