import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AboutUsPage extends BasePage {
  getAboutUsTitle = (): Locator =>
    this.page.getByRole('heading', { name: `About us` });
  getCloseButton = (): Locator =>
    this.page.locator('#videoModal').getByText('Close', { exact: true });
}
