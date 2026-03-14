import { test } from '@helpers/fixtures/ActionFactoryFixture';
import { Categories } from '@helpers/enums/Categories';
import { ProductFlows } from '@flows/ProductFlows';
import { Phones } from '@helpers/enums/Phones/Phones';
import { PhonePrices } from '@helpers/enums/Phones/PhonePrices';

test.describe('@regression @Order @Phones Check Phones category', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Add iPhone 6 to cart and verify price', async ({ actionFactory }) => {
    const homeActions = actionFactory.createHomeActions();
    const productActions = actionFactory.createProductActions();

    await test.step('When user navigates to Phones category', async () => {
      await homeActions.selectCategory(Categories.PHONES);
    });

    await test.step('Given product is added to cart', async () => {
      // Using ProductFlows for product operations
      await ProductFlows.addProductWithDetails(
        homeActions,
        productActions,
        Categories.PHONES,
        Phones.IPHONE_6,
        PhonePrices.IPHONE_6_PRICE,
      );
    });

    await test.step('Then verify iPhone 6 32GB price is correct', async () => {
      await homeActions.checkProductPrice(PhonePrices.IPHONE_6_PRICE);
    });
  });
});
