import { Locator, Page } from '@playwright/test';

export class ProductPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getProductLabel = (product:string):Locator => this.page.getByRole('heading', { name: `${product}`});
  getPriceLabel = (price: string): Locator => this.page.locator(`.price-container`, { hasText: `${price }`});
  getAddToCartButton = ():Locator => this.page.getByRole('link', {name: `Add to cart`,  exact: true});
  getProductDescription = (): Locator => this.page.locator('#more-information p');
}