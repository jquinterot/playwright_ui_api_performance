import { Locator, Page } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get navbarTitle(): Locator {
    return this.page.getByRole('link', { name: 'PRODUCT STORE' });
  }

  get homeMenuLink(): Locator {
    return this.page.getByRole('link', { name: 'Home', exact: true });
  }

  get contactMenuLink(): Locator {
    return this.page.getByRole('link', { name: 'Contact', exact: true });
  }

  get aboutUsMenuLink(): Locator {
    return this.page.getByRole('link', { name: 'About us', exact: true });
  }

  get cartMenuLink(): Locator {
    return this.page.getByRole('link', { name: 'Cart', exact: true });
  }

  get signUpMenuLink(): Locator {
    return this.page.getByRole('link', { name: 'Sign up', exact: true });
  }

  get logInMenuLink(): Locator {
    return this.page.getByRole('link', { name: 'Log in', exact: true });
  }

  get logOutMenuLink(): Locator {
    return this.page.getByRole('link', { name: 'Log out', exact: true });
  }

  get modalTitle(): Locator {
    return this.page.locator('.modal-title');
  }

  get modalBody(): Locator {
    return this.page.locator('.modal-body');
  }

  get closeModalButton(): Locator {
    return this.page.getByRole('button', { name: 'Close' });
  }

  get okButton(): Locator {
    return this.page.getByRole('button', { name: 'OK' });
  }

  get alertMessage(): Locator {
    return this.page.locator('.alert');
  }

  async clickMenuOption(
    option:
      | 'Home'
      | 'Contact'
      | 'About us'
      | 'Cart'
      | 'Sign up'
      | 'Log in'
      | 'Log out',
  ): Promise<void> {
    switch (option) {
      case 'Home':
        await this.homeMenuLink.click();
        break;
      case 'Contact':
        await this.contactMenuLink.click();
        break;
      case 'About us':
        await this.aboutUsMenuLink.click();
        break;
      case 'Cart':
        await this.cartMenuLink.click();
        break;
      case 'Sign up':
        await this.signUpMenuLink.click();
        break;
      case 'Log in':
        await this.logInMenuLink.click();
        break;
      case 'Log out':
        await this.logOutMenuLink.click();
        break;
    }
  }

  async waitForModal(title: string): Promise<void> {
    await this.modalTitle.waitFor();
    await expect(this.modalTitle).toHaveText(title);
  }

  async closeModal(): Promise<void> {
    await this.closeModalButton.click();
  }

  async acceptAlert(): Promise<void> {
    await this.okButton.click();
  }

  async getAlertText(): Promise<string> {
    const text = await this.alertMessage.textContent();
    return text ?? '';
  }

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }
}

function expect(locator: Locator) {
  return {
    toHaveText: async (text: string) => {
      await locator.waitFor();
      const actualText = await locator.textContent();
      if (!actualText?.includes(text)) {
        throw new Error(`Expected "${text}" but got "${actualText}"`);
      }
    },
  };
}
