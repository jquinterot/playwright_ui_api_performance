import { HomeActions } from '@actions/HomeActions';
import { ProductActions } from '@actions/ProductActions';
import { CartActions } from '@actions/CartActions';
import { PlaceOrderActions } from '@actions/PlaceOrderActions';
import { Phones } from '@helpers/enums/Phones/Phones';
import { PhonePrices } from '@helpers/enums/Phones/PhonePrices';
import { Categories } from '@helpers/enums/Categories';
import { Monitors } from '@helpers/enums/Monitors/Monitors';
import { MonitorPrices } from '@helpers/enums/Monitors/MonitorPrices';
import { MenuOptions } from '@helpers/enums/MenuOptions';
import { CustomerData } from '@helpers/test-data/types';
import { Page } from '@playwright/test';

export class CartFlows {
  // Now receives specific actions instead of factory
  // Previous: received ActionFactory and created actions internally (new instances each time)
  // Benefit: reuses injected action instances, better test isolation

  static setupDialogHandler(page: Page, expectedMessage: string): void {
    page.on('dialog', async (dialog) => {
      if (expectedMessage && !dialog.message().includes(expectedMessage)) {
        throw new Error(`Unexpected dialog: ${dialog.message()}`);
      }
      await dialog.accept();
    });
  }

  static async addProductToCart(
    homeActions: HomeActions,
    productActions: ProductActions,
    product: Phones,
    price: PhonePrices,
  ) {
    await homeActions.selectCategory(Categories.PHONES);
    await homeActions.selectProduct(product);

    await productActions.checkAddedProduct(product);
    await productActions.checkProductPrice(price);
    await productActions.addToCart();
  }

  static async addMonitorToCart(
    homeActions: HomeActions,
    productActions: ProductActions,
    monitor: Monitors,
    price: MonitorPrices,
  ) {
    await homeActions.selectCategory(Categories.MONITORS);
    await homeActions.selectProduct(monitor);

    await productActions.checkAddedProduct(monitor);
    await productActions.checkProductPrice(price);
    await productActions.addToCart();
  }

  static async addProductByName(
    homeActions: HomeActions,
    productActions: ProductActions,
    productName: string,
    category: 'Phones' | 'Monitors' | 'Laptops',
  ) {
    await homeActions.selectCategory(category);
    await homeActions.selectProduct(productName);

    await productActions.addToCart();
  }

  static async addProductAndVerifyInCart(
    homeActions: HomeActions,
    productActions: ProductActions,
    cartActions: CartActions,
    productName: string,
    category: 'Phones' | 'Monitors' | 'Laptops',
  ) {
    await this.addProductByName(
      homeActions,
      productActions,
      productName,
      category,
    );

    await homeActions.selectMenuOption('Cart');

    await cartActions.checkProductIsDisplayed(productName);
  }

  static async removeProductFromCart(
    cartActions: CartActions,
    productName: string,
  ) {
    await cartActions.deleteProductFromCard(productName);
  }

  static async completePurchase(
    homeActions: HomeActions,
    cartActions: CartActions,
    placeOrderActions: PlaceOrderActions,
    customer: CustomerData,
  ) {
    await homeActions.selectMenuOption(MenuOptions.CART);

    await cartActions.selectPlaceOrder();

    await placeOrderActions.fillName(customer.name);
    await placeOrderActions.fillCountry(customer.country);
    await placeOrderActions.fillCity(customer.city);
    await placeOrderActions.fillCard(customer.card);
    await placeOrderActions.fillMonth(customer.month);
    await placeOrderActions.fillYear(customer.year);
    await placeOrderActions.selectPurchase();
    await placeOrderActions.isThankYouMessageIsDisplayed();
  }

  static async fullPurchaseFlow(
    homeActions: HomeActions,
    productActions: ProductActions,
    cartActions: CartActions,
    placeOrderActions: PlaceOrderActions,
    productName: string,
    category: 'Phones' | 'Monitors' | 'Laptops',
    customer: CustomerData,
  ) {
    await this.addProductAndVerifyInCart(
      homeActions,
      productActions,
      cartActions,
      productName,
      category,
    );
    await this.completePurchase(
      homeActions,
      cartActions,
      placeOrderActions,
      customer,
    );
  }
}
