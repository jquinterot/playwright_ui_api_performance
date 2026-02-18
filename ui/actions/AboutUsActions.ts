import { AboutUsPage } from '../pages/AboutUsPage';
import { Page, expect } from '@playwright/test';

export class AboutUsActions {
  constructor(
    private readonly page: Page,
    private readonly aboutUsPage: AboutUsPage,
  ) {}

  async isAboutUsTitleDisplayed() {
    await expect(this.aboutUsPage.getAboutUsTitle()).toBeVisible();
  }

  async closeModal() {
    await this.aboutUsPage.getCloseButton().click();
  }
}
