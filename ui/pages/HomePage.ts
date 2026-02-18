import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  getNavBarTitle(): Locator {
    return this.page.getByRole('link', { name: 'PRODUCT STORE' });
  }

  getCategoryItems(category: string): Locator {
    return this.page.getByRole('link', { name: category });
  }

  getProduct(product: string): Locator {
    return this.page.getByRole('link', { name: product });
  }

  getProductPrice(price: string): Locator {
    return this.page.locator('.card-title h5', { hasText: price });
  }

  getNavbarMenuOption(menuOption: string): Locator {
    return this.page.getByRole('link', { name: menuOption, exact: true });
  }

  getPhonesCategory(): Locator {
    return this.page.getByRole('link', { name: 'Phones' });
  }
}
