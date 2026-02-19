import { SignUpPage } from '@pages/SignUpPage';
import { Page, expect } from '@playwright/test';

export class SignUpActions {
  constructor(
    private readonly page: Page,
    private readonly signUpPage: SignUpPage,
  ) {}

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
