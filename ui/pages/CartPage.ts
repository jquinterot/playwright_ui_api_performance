import { Locator, Page } from '@playwright/test';

export class CartPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getAddedProductTitle = (product:string):Locator =>  this.page.getByRole('cell', {name: `${product}`});
  getDeleteButton = ():Locator =>  this.page.getByRole('link', {name: `Delete`});
  getPlaceOrderButton = ():Locator => this.page.getByRole('button', {name: `Place Order`});
}
