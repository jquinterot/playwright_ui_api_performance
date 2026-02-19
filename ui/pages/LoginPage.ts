import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  getLoginModalTitle = (): Locator =>
    this.page.locator('#logInModal .modal-title');

  getUsernameInput = (): Locator => this.page.locator('#loginusername');

  getPasswordInput = (): Locator => this.page.locator('#loginpassword');

  getLoginButton = (): Locator =>
    this.page.getByRole('button', { name: 'Log in' });
}
