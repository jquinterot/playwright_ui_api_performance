import { Locator, Page } from '@playwright/test';

export class AboutUsPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getAboutUsTitle = ():Locator =>  this.page.getByRole('heading', {name: `About us`});
  getCloseButton = ():Locator => this.page.locator('#videoModal').getByText('Close', { exact: true });
}