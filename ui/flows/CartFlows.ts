import { HomeActions } from '@actions/HomeActions';
import { CartActions } from '@actions/CartActions';
import { PlaceOrderActions } from '@actions/PlaceOrderActions';
import { MenuOptions } from '@helpers/enums/MenuOptions';
import { CustomerData } from '@helpers/test-data/types';
import { Page } from '@playwright/test';

export class CartFlows {
  // Simplified - only cart-specific operations
  // Navigation moved to NavigationFlows
  // Product selection moved to ProductFlows
  // Checkout moved to CheckoutFlows

  static setupDialogHandler(page: Page, expectedMessage: string): void {
    page.on('dialog', async (dialog) => {
      if (expectedMessage && !dialog.message().includes(expectedMessage)) {
        throw new Error(`Unexpected dialog: ${dialog.message()}`);
      }
      dialog.accept();
    });
  }

  static async navigateToCart(homeActions: HomeActions): Promise<void> {
    await homeActions.selectMenuOption(MenuOptions.CART);
  }

  static async verifyProductInCart(
    cartActions: CartActions,
    productName: string,
  ): Promise<void> {
    await cartActions.checkProductIsDisplayed(productName);
  }

  static async removeProductFromCart(
    cartActions: CartActions,
    productName: string,
  ): Promise<void> {
    await cartActions.deleteProductFromCard(productName);
  }

  static async startCheckout(cartActions: CartActions): Promise<void> {
    await cartActions.selectPlaceOrder();
  }

  static async completePurchase(
    homeActions: HomeActions,
    cartActions: CartActions,
    placeOrderActions: PlaceOrderActions,
    customer: CustomerData,
  ): Promise<void> {
    await this.navigateToCart(homeActions);
    await this.startCheckout(cartActions);

    await placeOrderActions.fillName(customer.name);
    await placeOrderActions.fillCountry(customer.country);
    await placeOrderActions.fillCity(customer.city);
    await placeOrderActions.fillCard(customer.card);
    await placeOrderActions.fillMonth(customer.month);
    await placeOrderActions.fillYear(customer.year);
    await placeOrderActions.selectPurchase();
    await placeOrderActions.isThankYouMessageIsDisplayed();
  }
}
