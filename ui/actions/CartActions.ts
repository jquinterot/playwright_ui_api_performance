import { CartPage } from '@pages/CartPage';
import { Page, expect } from '@playwright/test';

export class CartActions {
  constructor(
    private readonly page: Page,
    private readonly cartPage: CartPage,
  ) {}

  async checkProductIsDisplayed(product: string) {
    await this.page.waitForLoadState('networkidle');
    const productText = product.toLowerCase();
    const locator = this.cartPage.getAddedProductTitle(product);
    await expect(locator).toBeVisible({ timeout: 10000 });
  }

  async deleteProductFromCard(product: string) {
    await this.cartPage.getDeleteButton().click();
    await expect(this.cartPage.getAddedProductTitle(product)).not.toBeVisible();
  }

  async selectPlaceOrder() {
    await this.cartPage.getPlaceOrderButton().click();
  }
}
