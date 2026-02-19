import { ContactPage } from '@pages/ContactPage';
import { Page, expect } from '@playwright/test';

export class ContactActions {
  constructor(
    private readonly page: Page,
    private readonly contactPage: ContactPage,
  ) {}

  async fillContactForm(email: string, name: string, message: string) {
    await this.contactPage.getEmailInput().fill(email);
    await this.contactPage.getNameInput().fill(name);
    await this.contactPage.getMessageInput().fill(message);
  }

  async sendMessage() {
    await this.contactPage.getSendMessageButton().click();
  }

  async verifyContactModalVisible() {
    await expect(this.contactPage.getContactModalTitle()).toBeVisible();
  }
}
