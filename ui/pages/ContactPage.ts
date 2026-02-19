import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  getContactModalTitle = (): Locator =>
    this.page.locator('#exampleModal .modal-title');

  getEmailInput = (): Locator => this.page.locator('#recipient-email');

  getNameInput = (): Locator => this.page.locator('#recipient-name');

  getMessageInput = (): Locator => this.page.locator('#message-text');

  getSendMessageButton = (): Locator =>
    this.page.getByRole('button', { name: 'Send message' });
}
