import { test, expect } from '@playwright/test';
import { ActionFactory } from '@actions/ActionsFactory';
import { TestDataLoader } from '@helpers/test-data/loader';

test.describe('@regression Add All Products To Cart', () => {
  let actionFactory: ActionFactory;

  test.beforeEach(async ({ page }) => {
    await page.goto('');
    actionFactory = new ActionFactory(page);
  });

  const phones = TestDataLoader.getPhones();

  for (const phone of phones) {
    test(`Add ${phone.name} to cart - price $${phone.price}`, async ({
      page,
    }) => {
      page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain('Product added');
        await dialog.accept();
      });

      const homeActions = actionFactory.createHomeActions();
      await homeActions.selectCategory('Phones');
      await homeActions.selectProduct(phone.name);

      const productActions = actionFactory.createProductActions();
      await productActions.checkAddedProduct(phone.name);
      await productActions.checkProductPrice(phone.price.toString());
      await productActions.addToCart();
    });
  }

  const monitors = TestDataLoader.getMonitors();

  for (const monitor of monitors) {
    test(`Add ${monitor.name} to cart - price $${monitor.price}`, async ({
      page,
    }) => {
      page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain('Product added');
        await dialog.accept();
      });

      const homeActions = actionFactory.createHomeActions();
      await homeActions.selectCategory('Monitors');
      await homeActions.selectProduct(monitor.name);

      const productActions = actionFactory.createProductActions();
      await productActions.checkAddedProduct(monitor.name);
      await productActions.checkProductPrice(monitor.price.toString());
      await productActions.addToCart();
    });
  }
});
