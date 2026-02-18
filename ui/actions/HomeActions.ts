import { HomePage } from '@pages/HomePage';
import { Page, expect } from '@playwright/test';

export class HomeActions {
  constructor(
    private readonly page: Page,
    private readonly homePage: HomePage,
  ) {}

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
