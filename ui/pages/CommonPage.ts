import { Page } from '@playwright/test';

export class CommonPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  //method here getAddedProductTitle = (product:string) =>  this.page.getByRole('cell', {name: `${product}`});

}