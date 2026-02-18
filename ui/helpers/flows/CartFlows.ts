import { ActionFactory } from '@actions/ActionsFactory';
import { Phones } from '@helpers/enums/Phones/Phones';
import { PhonePrices } from '@helpers/enums/Phones/PhonePrices';
import { Categories } from '@helpers/enums/Categories';
import { Monitors } from '@helpers/enums/Monitors/Monitors';
import { MonitorPrices } from '@helpers/enums/Monitors/MonitorPrices';
import { MenuOptions } from '@helpers/enums/MenuOptions';
import { Product, CustomerData } from '@helpers/test-data/types';
import { Page } from '@playwright/test';

export class CartFlows {
  static setupDialogHandler(page: Page, expectedMessage: string): void {
    page.on('dialog', async (dialog) => {
      if (expectedMessage && !dialog.message().includes(expectedMessage)) {
        throw new Error(`Unexpected dialog: ${dialog.message()}`);
      }
      await dialog.accept();
    });
  }

  static async addProductToCart(
    actionFactory: ActionFactory,
    product: Phones,
    price: PhonePrices,
  ) {
    const homeActions = actionFactory.createHomeActions();
    await homeActions.selectCategory(Categories.PHONES);
    await homeActions.selectProduct(product);

    const productActions = actionFactory.createProductActions();
    await productActions.checkAddedProduct(product);
    await productActions.checkProductPrice(price);
    await productActions.addToCart();
  }

  static async addMonitorToCart(
    actionFactory: ActionFactory,
    monitor: Monitors,
    price: MonitorPrices,
  ) {
    const homeActions = actionFactory.createHomeActions();
    await homeActions.selectCategory(Categories.MONITORS);
    await homeActions.selectProduct(monitor);

    const productActions = actionFactory.createProductActions();
    await productActions.checkAddedProduct(monitor);
    await productActions.checkProductPrice(price);
    await productActions.addToCart();
  }

  static async addProductByName(
    actionFactory: ActionFactory,
    productName: string,
    category: 'Phones' | 'Monitors' | 'Laptops',
  ) {
    const homeActions = actionFactory.createHomeActions();
    await homeActions.selectCategory(category);
    await homeActions.selectProduct(productName);

    const productActions = actionFactory.createProductActions();
    await productActions.addToCart();
  }

  static async addProductAndVerifyInCart(
    actionFactory: ActionFactory,
    productName: string,
    category: 'Phones' | 'Monitors' | 'Laptops',
  ) {
    await this.addProductByName(actionFactory, productName, category);

    const homeActions = actionFactory.createHomeActions();
    await homeActions.selectMenuOption('Cart');

    const cartActions = actionFactory.createCartActions();
    await cartActions.checkProductIsDisplayed(productName);
  }

  static async removeProductFromCart(
    actionFactory: ActionFactory,
    productName: string,
  ) {
    const cartActions = actionFactory.createCartActions();
    await cartActions.deleteProductFromCard(productName);
  }

  static async completePurchase(
    actionFactory: ActionFactory,
    customer: CustomerData,
  ) {
    const homeActions = actionFactory.createHomeActions();
    await homeActions.selectMenuOption(MenuOptions.CART);

    const cartActions = actionFactory.createCartActions();
    await cartActions.selectPlaceOrder();

    const placeOrderActions = actionFactory.createPlaceOrderActions();
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
    actionFactory: ActionFactory,
    productName: string,
    category: 'Phones' | 'Monitors' | 'Laptops',
    customer: CustomerData,
  ) {
    await this.addProductAndVerifyInCart(actionFactory, productName, category);
    await this.completePurchase(actionFactory, customer);
  }
}
