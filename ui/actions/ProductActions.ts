import { ProductPage } from '../pages/ProductPage';
import { Page, expect } from '@playwright/test';

export class ProductActions {
  constructor(
    private readonly page: Page,
    private readonly productPage: ProductPage,
  ) {}

  async checkHomePageTitle(page: Page) {
    await expect(page).toHaveTitle(/STORE/);
  }

  async checkAddedProduct(product: string) {
    await expect(this.productPage.getProductLabel(product)).toHaveText(
      `${product}`,
    );
  }

  async checkProductPrice(price: string) {
    await expect(this.productPage.getPriceLabel(`$${price}`)).toHaveText(
      `$${price} *includes tax`,
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
