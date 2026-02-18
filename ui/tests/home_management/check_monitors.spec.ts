import { test } from '@helpers/fixtures/ActionFactoryFixture';
import { Categories } from '@helpers/enums/Categories';
import { Monitors } from '@helpers/enums/Monitors/Monitors';
import { MonitorPrices } from '@helpers/enums/Monitors/MonitorPrices';

test.describe('@regression @Order @Monitor Check Monitors category', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Validate Monitors category products', async ({ actionFactory }) => {
    const homeActions = actionFactory.createHomeActions();

    await test.step('When user navigates to Monitors category', async () => {
      await homeActions.selectCategory(Categories.MONITORS);
    });

    await test.step('Then validate product details in Monitors category', async () => {
      const expectedProduct = {
        name: Monitors.APPLE_MONITOR_24,
        price: MonitorPrices.APPLE_MONITOR_24_PRICE,
      };
      await homeActions.checkProductPrice(expectedProduct.price);
    });
  });
});
