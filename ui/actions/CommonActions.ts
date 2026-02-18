import { CommonPage } from '../pages/CommonPage';
import { Page } from '@playwright/test';

export class CommonActions {
  constructor(
    private readonly page: Page,
    private readonly commonPage: CommonPage,
  ) {}
}
