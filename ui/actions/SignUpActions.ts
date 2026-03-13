import { SignUpPage } from '@pages/SignUpPage';
import { expect, Page } from '@playwright/test';

export class SignUpActions {
  // Simplified constructor - PageObject already has access to page internally
  // Previous: passed both `page` and `signUpPage`, causing redundancy
  constructor(private readonly signUpPage: SignUpPage) {}

  get page(): Page {
    return this.signUpPage.getPage();
  }

  async fillUsername(username: string) {
    await this.signUpPage.getUserNameInput().fill(username);
  }

  async fillPassword(password: string) {
    await this.signUpPage.getUserPasswordInput().fill(password);
  }

  async clickSignUpButton() {
    await this.signUpPage.getSignupButton().click();
  }

  async checkDialogMessage(message: string) {
    this.page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain(message);
      await dialog.accept();
    });
  }
}
