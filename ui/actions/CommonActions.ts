import { CommonPage } from '@pages/CommonPage';
import { Page } from '@playwright/test';

export class CommonActions {
  // Simplified constructor - PageObject already has access to page internally
  // Previous: passed both `page` and `commonPage`, causing redundancy
  constructor(private readonly commonPage: CommonPage) {}

  get page(): Page {
    return this.commonPage.getPage();
  }
}
