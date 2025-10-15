import { test } from '../../../helpers/fixtures/ActionFactoryFixture';
import { Phones } from '../../../helpers/enums/Phones/Phones';
import { PhonePrices } from '../../../helpers/enums/Phones/PhonePrices';
import { MenuOptions } from '../../../helpers/enums/MenuOptions';
import { Categories } from '../../../helpers/enums/Categories';
import { CartFlows } from '../../../helpers/flows/CartFlows';

test.describe('@regression @Order @Phones Add Galaxy S6 to cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Check that a Samsung cellphone can be added', async ({
    actionFactory,
  }) => {
    const homeActions = actionFactory.createHomeActions();

    await test.step('Given product is added to cart', async () => {
      await CartFlows.addProductToCart(
        actionFactory,
        Phones.GALAXY_S6,
        PhonePrices.GALAXY_S6_PRICE,
      );
    });

    await test.step('And goes to cart', async () => {
      await homeActions.selectMenuOption(MenuOptions.CART);
    });

    const cartActions = actionFactory.createCartActions();

    await test.step('Then the Samsung Galaxy S6 is added to cart', async () => {
      await cartActions.checkProductIsDisplayed(Phones.GALAXY_S6);
    });

    await test.step('And the Samsung Galaxy S6 product is deleted', async () => {
      await cartActions.deleteProductFromCard(Phones.GALAXY_S6);
    });
  });
});

// TODO (test-quality):
// - Replace `page.goto('')` with baseURL-aware navigation (e.g. `page.goto('/')` or use a helper) to make intent explicit.
// - Make cart item lookups case-insensitive / whitespace-robust. Use regex locators like /Samsung galaxy s6/i when verifying items in cart.
// - After asserting the product is visible, also assert key details (price, qty) to reduce false positives.
// - Consider a small data-shape for products (name, price, sku) and pass that into CartFlows to avoid duplicated args.
// - Avoid hard assertions against exact text formatting for prices; prefer `toContainText` or regex to tolerate additional text like "*includes tax".
