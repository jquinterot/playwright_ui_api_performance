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
    // demoblaze's catalog can contain the SAME product twice (e.g. two
    // identical "HTC One M9" cards, both href prod.html?idp_=7), which breaks
    // strict mode on a bare getByRole(). Scope to the card title and pick the
    // first match — deterministic, and identical hrefs make it safe.
    return this.page
      .locator('.card-title')
      .filter({ hasText: product })
      .locator('a')
      .first();
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
