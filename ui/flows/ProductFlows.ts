import { ProductActions } from '@actions/ProductActions';
import { HomeActions } from '@actions/HomeActions';
import { Categories } from '@helpers/enums/Categories';
import { Page } from '@playwright/test';

export class ProductFlows {
  // Extracted from tests - repeated pattern of selecting product and adding to cart

  static async selectProductAndVerify(
    homeActions: HomeActions,
    productActions: ProductActions,
    category: Categories | string,
    productName: string,
  ): Promise<void> {
    await homeActions.selectCategory(category);
    await homeActions.selectProduct(productName);
    await productActions.checkAddedProduct(productName);
  }

  static async addProductToCart(
    productActions: ProductActions,
    productName: string,
    price: string,
  ): Promise<void> {
    await productActions.checkAddedProduct(productName);
    await productActions.checkProductPrice(price);
    await productActions.addToCart();
  }

  static async addProductWithDetails(
    homeActions: HomeActions,
    productActions: ProductActions,
    category: Categories | string,
    productName: string,
    price: string,
  ): Promise<void> {
    await this.selectProductAndVerify(
      homeActions,
      productActions,
      category,
      productName,
    );
    await this.addProductToCart(productActions, productName, price);
  }

  static setupAddToCartDialogHandler(
    page: Page,
    expectedMessage: string = 'Product added',
  ): void {
    page.on('dialog', async (dialog) => {
      if (expectedMessage && !dialog.message().includes(expectedMessage)) {
        throw new Error(`Unexpected dialog: ${dialog.message()}`);
      }
      dialog.accept();
    });
  }
}
