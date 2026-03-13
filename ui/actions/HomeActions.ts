import { HomePage } from '@pages/HomePage';
import { expect, Page } from '@playwright/test';

export class HomeActions {
  // Simplified constructor - PageObject already has access to page internally
  // Previous: passed both `page` and `homePage`, causing redundancy
  constructor(private readonly homePage: HomePage) {}

  // Expose page via PageObject's getPage() method instead of exposing protected property
  get page(): Page {
    return this.homePage.getPage();
  }

  async checkHomePageTitle(page: Page) {
    await expect(page).toHaveTitle(/STORE/);
  }

  async verifyHomePageNavbarTitle() {
    await expect(this.homePage.getNavBarTitle()).toHaveText('PRODUCT STORE');
  }

  async selectCategory(category: string) {
    await this.homePage.getCategoryItems(category).click();
  }

  async selectProduct(product: string) {
    await this.homePage.getProduct(product).click();
  }

  async selectMenuOption(menuOption: string) {
    await this.homePage.getNavbarMenuOption(menuOption).click();
  }

  async checkProductPrice(price: string) {
    await this.homePage.getProductPrice(price).isVisible();
  }
}
