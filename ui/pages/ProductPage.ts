import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  getProductLabel = (product: string): Locator =>
    this.page.getByRole('heading', { name: `${product}` });
  getPriceLabel = (price: string): Locator =>
    this.page.locator(`.price-container`, { hasText: `${price}` });
  getAddToCartButton = (): Locator =>
    this.page.getByRole('link', { name: `Add to cart`, exact: true });
  getProductDescription = (): Locator =>
    this.page.locator('#more-information p');
}
