import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignUpPage extends BasePage {
  getUserNameInput = (): Locator => this.page.locator('#sign-username');
  getUserPasswordInput = (): Locator => this.page.locator('#sign-password');
  getSignupButton = (): Locator =>
    this.page.getByRole('button', { name: 'Sign up' });
}
