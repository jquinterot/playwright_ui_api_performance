import { ContactPage } from '@pages/ContactPage';
import { expect, Page } from '@playwright/test';

export class ContactActions {
  // Simplified constructor - PageObject already has access to page internally
  // Previous: passed both `page` and `contactPage`, causing redundancy
  constructor(private readonly contactPage: ContactPage) {}

  get page(): Page {
    return this.contactPage.getPage();
  }

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
