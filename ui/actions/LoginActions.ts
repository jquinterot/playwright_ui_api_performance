import { LoginPage } from '@pages/LoginPage';
import { Page, expect, Locator } from '@playwright/test';

export class LoginActions {
  constructor(
    private readonly page: Page,
    private readonly loginPage: LoginPage,
  ) {}

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
    return this.page.locator('#log-in-modal .alert');
  }
}
