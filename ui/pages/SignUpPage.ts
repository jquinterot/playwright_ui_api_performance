import { Locator, Page } from '@playwright/test';

export class SignUpPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getUserNameInput = ():Locator => this.page.locator('#sign-username');
  getUserPasswordInput = ():Locator => this.page.locator('#sign-password');
  getSignupButton = ():Locator => this.page.getByRole('button', { name: 'Sign up'});
}