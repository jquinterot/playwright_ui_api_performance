import { HomeActions } from '@actions/HomeActions';
import { LoginActions } from '@actions/LoginActions';
import { SignUpActions } from '@actions/SignUpActions';
import { MenuOptions } from '@helpers/enums/MenuOptions';
import { Page } from '@playwright/test';

export class AuthFlows {
  // Extracted from tests - login and signup are auth operations

  static async openLoginModal(
    homeActions: HomeActions,
    loginActions: LoginActions,
  ): Promise<void> {
    await homeActions.selectMenuOption(MenuOptions.LOG_IN);
    await loginActions.verifyLoginModalVisible();
  }

  static async login(
    loginActions: LoginActions,
    username: string,
    password: string,
  ): Promise<void> {
    await loginActions.fillUsername(username);
    await loginActions.fillPassword(password);
    await loginActions.clickLogin();
  }

  static async fullLogin(
    homeActions: HomeActions,
    loginActions: LoginActions,
    username: string,
    password: string,
  ): Promise<void> {
    await this.openLoginModal(homeActions, loginActions);
    await this.login(loginActions, username, password);
  }

  static async openSignUpModal(homeActions: HomeActions): Promise<void> {
    await homeActions.selectMenuOption(MenuOptions.SIGN_UP);
  }

  static async signUp(
    signUpActions: SignUpActions,
    username: string,
    password: string,
  ): Promise<void> {
    await signUpActions.fillUsername(username);
    await signUpActions.fillPassword(password);
    await signUpActions.clickSignUpButton();
  }

  static async fullSignUp(
    homeActions: HomeActions,
    signUpActions: SignUpActions,
    username: string,
    password: string,
  ): Promise<void> {
    await this.openSignUpModal(homeActions);
    await this.signUp(signUpActions, username, password);
  }

  static setupSignUpDialogHandler(page: Page, expectedMessage: string): void {
    page.on('dialog', async (dialog) => {
      dialog.accept();
    });
  }
}
