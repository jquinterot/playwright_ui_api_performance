import { test } from '@helpers/fixtures/ActionFactoryFixture';
import { Categories } from '@helpers/enums/Categories';
import { expect } from '@playwright/test';
import { CartFlows } from '@helpers/flows/CartFlows';
import { Phones } from '@helpers/enums/Phones/Phones';
import { PhonePrices } from '@helpers/enums/Phones/PhonePrices';

test.describe('@regression @Order @Phones Check Phones category', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Validate iPhone 6 32GB details', async ({ actionFactory }) => {
    const homeActions = actionFactory.createHomeActions();
    const productActions = actionFactory.createProductActions();

    await test.step('When user navigates to Phones category', async () => {
      await homeActions.selectCategory(Categories.PHONES);
    });

    await test.step('Given product is added to cart', async () => {
      await CartFlows.addProductToCart(
        actionFactory,
        Phones.IPHONE_6,
        PhonePrices.IPHONE_6_PRICE,
      );
    });

    await test.step('Then validate iPhone 6 32GB details', async () => {
      const productName = Phones.IPHONE_6;
      const productPrice = PhonePrices.IPHONE_6_PRICE;
      const productDescription = `It comes with 1GB of RAM. The phone packs 16GB of internal storage 
cannot be expanded. As far as the cameras are concerned, the Apple 
iPhone 6 packs a 8-megapixel primary camera on the rear and a 
1.2-megapixel front shooter for selfies.`;

      await homeActions.checkProductPrice(productPrice);
    });
  });
});
