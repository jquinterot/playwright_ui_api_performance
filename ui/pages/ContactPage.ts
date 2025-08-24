import { Page } from '@playwright/test';

export class ContactPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}