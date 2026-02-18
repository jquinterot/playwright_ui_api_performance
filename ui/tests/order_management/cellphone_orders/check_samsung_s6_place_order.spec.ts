import { test } from '@helpers/fixtures/ActionFactoryFixture';
import { Phones } from '@helpers/enums/Phones/Phones';
import { PhonePrices } from '@helpers/enums/Phones/PhonePrices';
import { MenuOptions } from '@helpers/enums/MenuOptions';
import { johnCardInfo } from '@helpers/objects/CardInfo';
import { johnInfo } from '@helpers/objects/CustomerInfo';
import { CartFlows } from '@helpers/flows/CartFlows';

test.describe('@regression @Order Check place order', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Check that a samsung cellphone can be ordered', async ({
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

    await test.step('When selects place order', async () => {
      await cartActions.selectPlaceOrder();
    });

    const placeOrderActions = actionFactory.createPlaceOrderActions();

    await test.step('And fills place order form', async () => {
      await placeOrderActions.fillName(johnInfo.name);
      await placeOrderActions.fillCountry(johnInfo.country);
      await placeOrderActions.fillCity(johnInfo.city);
      await placeOrderActions.fillCard(johnCardInfo.number);
      await placeOrderActions.fillMonth(johnCardInfo.month);
      await placeOrderActions.fillYear(johnCardInfo.year);
    });

    await test.step('And selects purchase', async () => {
      await placeOrderActions.selectPurchase();
    });

    await test.step('Then thank you message is displayed', async () => {
      await placeOrderActions.isThankYouMessageIsDisplayed();
    });
  });

  // TODO (test design):
  // - This test covers add-to-cart, delete, place order and confirmation. Consider splitting into two focused tests: (1) add/delete flow, (2) place-order flow — easier to debug on failures.
  // - Validate the order confirmation contains a numeric order id or expected success text. Attach the confirmation payload to test.info() for later debugging.
  // - Move card/customer fixtures into test fixtures where possible so test parameters are clearer and fewer hard-coded values remain in the test body.
  // - Consider adding assertions that delete actually removes the product from the DOM (e.g., `expect(locator).toHaveCount(0)`).
});
