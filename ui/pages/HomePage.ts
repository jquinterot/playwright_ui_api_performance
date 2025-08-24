import { Locator, Page } from '@playwright/test';

export class HomePage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getNavBarTitle = ():Locator => this.page.getByRole('link', { name: 'PRODUCT STORE' });
  getCategoryItems = (category:string):Locator => this.page.getByRole('link', { name: `${category}`});
  getProduct = (product:string):Locator =>  this.page.getByRole('link', {name: `${product}`});
  getNavbarMenuOption = (menuOption:string):Locator => this.page.getByRole('link', {name: `${menuOption}`, exact: true});
}
