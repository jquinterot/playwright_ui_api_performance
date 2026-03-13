import { LoginPage } from '@pages/LoginPage';
import { expect, Locator, Page } from '@playwright/test';

export class LoginActions {
  // Simplified constructor - PageObject already has access to page internally
  // Previous: passed both `page` and `loginPage`, causing redundancy
  constructor(private readonly loginPage: LoginPage) {}

  get page(): Page {
    return this.loginPage.getPage();
  }

  async fillUsername(username: string) {
    await this.loginPage.getUsernameInput().fill(username);
  }

  async fillPassword(password: string) {
    await this.loginPage.getPasswordInput().fill(password);
  }

  async clickLogin() {
    await this.loginPage.getLoginButton().click();
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async verifyLoginModalVisible() {
    await expect(this.loginPage.getLoginModalTitle()).toBeVisible();
  }

  getAlertMessage(): Locator {
    return this.page.locator('#log-in-modal');
  }
}
