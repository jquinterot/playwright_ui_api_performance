import { test } from '../../helpers/fixtures/ActionFactoryFixture';
import { Phones } from '../../helpers/enums/Phones/Phones';
import { PhonePrices } from '../../helpers/enums/Phones/PhonePrices';
import { MenuOptions } from '../../helpers/enums/MenuOptions';
import { CartFlows } from '../../helpers/flows/CartFlows';

test.describe('@regression @Order @Phones Add Nokia Lumia 1520 to cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Check that a Nokia Lumia 1520 can be added', async ({
    actionFactory,
  }) => {
    const homeActions = actionFactory.createHomeActions();

    await test.step('Given product is added to cart', async () => {
      await CartFlows.addProductToCart(
        actionFactory,
        Phones.NOKIA_LUMIA_1520,
        PhonePrices.NOKIA_LUMIA_1520_PRICE,
      );
    });

    await test.step('And goes to cart', async () => {
      await homeActions.selectMenuOption(MenuOptions.CART);
    });

    const cartActions = actionFactory.createCartActions();

    await test.step('Then the Nokia Lumia 1520 is added to cart', async () => {
      await cartActions.checkProductIsDisplayed(Phones.NOKIA_LUMIA_1520);
    });

    await test.step('And the Nokia Lumia 1520 product is deleted', async () => {
      await cartActions.deleteProductFromCard(Phones.NOKIA_LUMIA_1520);
    });
  });
});