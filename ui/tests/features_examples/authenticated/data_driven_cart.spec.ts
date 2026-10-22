import { Categories } from '@helpers/enums/Categories';
import { test } from '@helpers/fixtures/ActionFactoryFixture';
import { TestDataLoader } from '@helpers/test-data/TestDataLoader';

/**
 * THREE framework patterns combined in one spec:
 *
 * 1. AUTH setup project + storageState (see ui/tests/auth/auth.setup.ts).
 *    This file lives under `authenticated/`, so it runs ONLY in the
 *    `chromium-authenticated` project, which injects the saved login session
 *    into every test — no login step, no duplicated credentials.
 *
 * 2. DATA-DRIVEN test rows. The legacy spec
 *    (ui/tests/order_management/product_orders/add_all_products_to_cart.spec.ts)
 *    loops over products INSIDE a single test: one giant test, one giant
 *    failure, zero parallelism. Here, each product becomes its own test ROW:
 *    granular HTML report, independent failure isolation, parallel speed.
 *
 * 3. TEST LOCKS (1.63). The demoblaze cart is SHARED SERVER STATE for the
 *    account, so every row holds ONE lock — rows never run concurrently even
 *    though everything runs in parallel.
 *
 * Run it:
 *   cd ui && npx @playwright/test test tests/features_examples/authenticated --project=chromium-authenticated
 */
const phones = TestDataLoader.getPhones();
const sharedCartLock = 'demoblaze-cart';

test.describe('@learning @authenticated Data-driven cart rows', () => {
  for (const phone of phones) {
    test(
      `Add ${phone.name} to cart and clean up`,
      { lock: sharedCartLock },
      async ({ shoppingFlow }) => {
        await shoppingFlow.openStore();

        // The flow centralizes what used to be three copies of dialog
        // handling + Add to cart orchestration (ProductFlows/CartFlows).
        await shoppingFlow.addProductToCart(
          Categories.PHONES,
          phone.name,
          phone.price.toString(),
        );

        await shoppingFlow.viewCart();
        await shoppingFlow.verifyProductInCart(phone.name);

        // The cart persists server-side per account token — always clean up,
        // otherwise the NEXT row (or test run) starts from a polluted cart.
        await shoppingFlow.removeProductFromCart(phone.name);
      },
    );
  }
});
