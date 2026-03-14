import { HomeActions } from '@actions/HomeActions';
import { CartActions } from '@actions/CartActions';
import { PlaceOrderActions } from '@actions/PlaceOrderActions';
import { MenuOptions } from '@helpers/enums/MenuOptions';
import { CustomerData } from '@helpers/test-data/types';

export class CheckoutFlows {
  // Extracted from CartFlows - checkout is a distinct responsibility

  static async navigateToCart(homeActions: HomeActions): Promise<void> {
    await homeActions.selectMenuOption(MenuOptions.CART);
  }

  static async startCheckout(cartActions: CartActions): Promise<void> {
    await cartActions.selectPlaceOrder();
  }

  static async fillCustomerInfo(
    placeOrderActions: PlaceOrderActions,
    customer: CustomerData,
  ): Promise<void> {
    await placeOrderActions.fillName(customer.name);
    await placeOrderActions.fillCountry(customer.country);
    await placeOrderActions.fillCity(customer.city);
    await placeOrderActions.fillCard(customer.card);
    await placeOrderActions.fillMonth(customer.month);
    await placeOrderActions.fillYear(customer.year);
  }

  static async completePurchase(
    placeOrderActions: PlaceOrderActions,
  ): Promise<void> {
    await placeOrderActions.selectPurchase();
    await placeOrderActions.isThankYouMessageIsDisplayed();
  }

  static async fullCheckout(
    homeActions: HomeActions,
    cartActions: CartActions,
    placeOrderActions: PlaceOrderActions,
    customer: CustomerData,
  ): Promise<void> {
    await this.navigateToCart(homeActions);
    await this.startCheckout(cartActions);
    await this.fillCustomerInfo(placeOrderActions, customer);
    await this.completePurchase(placeOrderActions);
  }
}
