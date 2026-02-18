import { ContactPage } from '@pages/ContactPage';
import { Page } from '@playwright/test';

export class ContactActions {
  constructor(
    private readonly page: Page,
    private readonly contactPage: ContactPage,
  ) {}
}
