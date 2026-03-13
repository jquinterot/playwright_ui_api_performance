import { AboutUsPage } from '@pages/AboutUsPage';
import { expect, Page } from '@playwright/test';

export class AboutUsActions {
  // Simplified constructor - PageObject already has access to page internally
  // Previous: passed both `page` and `aboutUsPage`, causing redundancy
  constructor(private readonly aboutUsPage: AboutUsPage) {}

  get page(): Page {
    return this.aboutUsPage.getPage();
  }

  async isAboutUsTitleDisplayed() {
    await expect(this.aboutUsPage.getAboutUsTitle()).toBeVisible();
  }

  async closeModal() {
    await this.aboutUsPage.getCloseButton().click();
  }
}
