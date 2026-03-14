import { HomeActions } from '@actions/HomeActions';
import { MenuOptions } from '@helpers/enums/MenuOptions';
import { Categories } from '@helpers/enums/Categories';

export class NavigationFlows {
  // Extracted from tests - repeated pattern of navigating to home then selecting menu/category

  static async navigateToHome(homeActions: HomeActions): Promise<void> {
    // Common pattern: page.goto('') - now just navigate, no action needed as baseURL handles it
  }

  static async openMenuOption(
    homeActions: HomeActions,
    option: MenuOptions,
  ): Promise<void> {
    await homeActions.selectMenuOption(option);
  }

  static async selectCategory(
    homeActions: HomeActions,
    category: Categories | string,
  ): Promise<void> {
    await homeActions.selectCategory(category);
  }

  static async selectProduct(
    homeActions: HomeActions,
    productName: string,
  ): Promise<void> {
    await homeActions.selectProduct(productName);
  }

  static async navigateToCategoryAndSelectProduct(
    homeActions: HomeActions,
    category: Categories | string,
    productName: string,
  ): Promise<void> {
    await this.selectCategory(homeActions, category);
    await this.selectProduct(homeActions, productName);
  }
}
