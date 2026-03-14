import { test } from '@helpers/fixtures/ActionFactoryFixture';
import { TestDataLoader } from '@helpers/test-data/TestDataLoader';
import { ProductFlows } from '@flows/ProductFlows';

test.describe('@regression Add All Products To Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    ProductFlows.setupAddToCartDialogHandler(page);
  });

  const phones = TestDataLoader.getPhones();

  for (const phone of phones) {
    test(`Add ${phone.name} to cart - price $${phone.price}`, async ({
      actionFactory,
    }) => {
      const homeActions = actionFactory.createHomeActions();
      const productActions = actionFactory.createProductActions();

      await ProductFlows.addProductWithDetails(
        homeActions,
        productActions,
        'Phones',
        phone.name,
        phone.price.toString(),
      );
    });
  }

  const monitors = TestDataLoader.getMonitors();

  for (const monitor of monitors) {
    test(`Add ${monitor.name} to cart - price $${monitor.price}`, async ({
      actionFactory,
    }) => {
      const homeActions = actionFactory.createHomeActions();
      const productActions = actionFactory.createProductActions();

      await ProductFlows.addProductWithDetails(
        homeActions,
        productActions,
        'Monitors',
        monitor.name,
        monitor.price.toString(),
      );
    });
  }
});
