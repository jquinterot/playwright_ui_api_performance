import { ProductPage } from '@pages/ProductPage';
import { expect, Page } from '@playwright/test';

export class ProductActions {
  // Simplified constructor - PageObject already has access to page internally
  // Previous: passed both `page` and `productPage`, causing redundancy
  constructor(private readonly productPage: ProductPage) {}

  get page(): Page {
    return this.productPage.getPage();
  }

  async checkHomePageTitle(page: Page) {
    await expect(page).toHaveTitle(/STORE/);
  }

  async checkAddedProduct(product: string) {
    await expect(this.productPage.getProductLabel(product)).toHaveText(
      `${product}`,
    );
  }

  async checkProductPrice(price: string) {
    await expect(this.productPage.getPriceLabel(`$${price}`)).toContainText(
      `$${price}`,
    );
  }

  async addToCart() {
    await this.productPage.getAddToCartButton().click();
  }

  async checkProductDescription(description: string) {
    const descriptionLocator = this.productPage.getProductDescription();
    await expect(descriptionLocator).toContainText(new RegExp(description));
  }
}
