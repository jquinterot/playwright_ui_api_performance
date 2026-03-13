import { CartPage } from '@pages/CartPage';
import { Page } from '@playwright/test';

export class CartActions {
  // Simplified constructor - PageObject already has access to page internally
  // Previous: passed both `page` and `cartPage`, causing redundancy
  constructor(private readonly cartPage: CartPage) {}

  get page(): Page {
    return this.cartPage.getPage();
  }

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

import { expect } from '@playwright/test';
