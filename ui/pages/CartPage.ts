import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  getAddedProductTitle = (product: string): Locator =>
    this.page.getByRole('cell', { name: `${product}` });
  getDeleteButton = (): Locator =>
    this.page.getByRole('link', { name: `Delete` });
  getPlaceOrderButton = (): Locator =>
    this.page.getByRole('button', { name: `Place Order` });
}
