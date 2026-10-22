import { ActionFactory } from '@actions/ActionsFactory';
import { CartActions } from '@actions/CartActions';
import { HomeActions } from '@actions/HomeActions';
import { ProductActions } from '@actions/ProductActions';
import { Categories } from '@helpers/enums/Categories';
import { MenuOptions } from '@helpers/enums/MenuOptions';
import { expect, Page, Dialog } from '@playwright/test';

/**
 * ShoppingFlow — the INSTANCE flow pattern (vs. the legacy static flows).
 *
 * Why instances instead of statics?
 * - The object owns its own state (page, actions) instead of threading
 *   parameters through `static method(homeActions, productActions, page, ...)`.
 * - The custom fixture hands it to specs like any other fixture.
 * - Shared logic lives in ONE place: the dialog handling here replaces the
 *   three identical static dialog handlers (ProductFlows/CartFlows/AuthFlows).
 *
 * It also implements SELF-PROVISIONING TEST DATA (session lifecycle pattern):
 * demoblaze's shared `testuser` no longer accepts its well-known password, and
 * the legacy suite only "passes" because it asserts nothing after login. The
 * flow provisions a brand-new unique account per run and logs in with it —
 * no environment coupling, no silent failures.
 */

export type Credentials = { username: string; password: string };

/** Generates a guaranteed-unique, demoblaze-safe username per run. */
export function generateTestUser(): Credentials {
  const username = `pw_user_${Date.now().toString(36)}`;
  return { username, password: 'Playwright!123' };
}

export class ShoppingFlow {
  private readonly page: Page;
  private readonly actionFactory: ActionFactory;
  private readonly homeActions: HomeActions;
  private readonly productActions: ProductActions;
  private readonly cartActions: CartActions;

  constructor(page: Page) {
    this.page = page;
    this.actionFactory = new ActionFactory(page);
    this.homeActions = this.actionFactory.createHomeActions();
    this.productActions = this.actionFactory.createProductActions();
    this.cartActions = this.actionFactory.createCartActions();
  }

  getPage(): Page {
    return this.page;
  }

  // ── Dialog handling (de-duplicated from ProductFlows/CartFlows/AuthFlows) ──

  /**
   * demoblaze confirms actions with native alert() dialogs. IMPORTANT: the
   * handler must be registered BEFORE the action that opens the dialog —
   * registering after the click is a flakiness race (the dialog may fire
   * before the listener exists).
   */
  interceptNextDialog(expectedMessage = 'Product added'): void {
    this.page.once('dialog', (dialog) => {
      if (!dialog.message().includes(expectedMessage)) {
        throw new Error(
          `Unexpected dialog: "${dialog.message()}", expected something containing "${expectedMessage}"`,
        );
      }
      void dialog.accept();
    });
  }

  // ── Journeys ────────────────────────────────────────────────────────────────

  /** Opens the store front page. */
  async openStore(): Promise<void> {
    await this.page.goto('');
  }

  /**
   * Strict login: demoblaze only speaks through dialogs, and SUCCESS has NO
   * dialog at all — it closes the modal and reloads. So: *any* dialog during
   * login means FAILURE, and we fail fast with its exact message instead of
   * silently accepting it (that is how the old suite hid a broken account).
   */
  async login(username: string, password: string): Promise<void> {
    const loginActions = this.actionFactory.createLoginActions();

    await this.homeActions.selectMenuOption(MenuOptions.LOG_IN);
    await loginActions.verifyLoginModalVisible();

    // Capture (don't silently dismiss) any dialog raised by the login call:
    // "Wrong password." / "User does not exist." / etc. The listener is
    // detached right after the gesture so it can't swallow later dialogs.
    let failureMessage: string | null = null;
    const onDialog = async (dialog: Dialog) => {
      failureMessage = dialog.message();
      await dialog.accept();
    };
    this.page.on('dialog', onDialog);
    try {
      await loginActions.login(username, password);
      // demoblaze reloads the page after a successful login; wait for the
      // session state instead of guessing with sleeps.
      await expect(this.page.locator('#logInModal')).toBeHidden();
    } finally {
      this.page.off('dialog', onDialog);
    }

    if (failureMessage) {
      throw new Error(`Login failed — demoblaze dialog: "${failureMessage}"`);
    }
  }

  /**
   * Registers a brand-new account through the real UI, then logs in.
   * The uniquely-per-run user is the cleanest demo-site lifecycle: every run
   * gets a pristine account, and parallel workers can also provision their
   * own (uniqueness comes from the timestamp suffix).
   */
  async signUpAndLogin(): Promise<Credentials> {
    const signUpActions = this.actionFactory.createSignUpActions();
    const credentials = generateTestUser();

    await this.homeActions.selectMenuOption(MenuOptions.SIGN_UP);
    await this.interceptNextDialog('Sign up successful');
    await signUpActions.fillUsername(credentials.username);
    await signUpActions.fillPassword(credentials.password);
    await signUpActions.clickSignUpButton();
    await expect(this.page.locator('#signInModal')).toBeHidden();

    await this.login(credentials.username, credentials.password);
    return credentials;
  }

  /** Selects a category → opens a product → verifies details → adds to cart. */
  async addProductToCart(
    category: Categories,
    productName: string,
    price: string,
  ): Promise<void> {
    await this.homeActions.selectCategory(category);
    await this.homeActions.selectProduct(productName);

    await this.productActions.checkAddedProduct(productName);
    await this.productActions.checkProductPrice(price);

    this.interceptNextDialog('Product added');
    await this.productActions.addToCart();
  }

  /** Navigates to the shopping cart view. */
  async viewCart(): Promise<void> {
    await this.homeActions.selectMenuOption(MenuOptions.CART);
  }

  /** Verifies a product is listed in the cart. */
  async verifyProductInCart(productName: string): Promise<void> {
    await this.cartActions.checkProductIsDisplayed(productName);
  }

  /** Cleaning up after tests: removes a product from the cart. */
  async removeProductFromCart(productName: string): Promise<void> {
    await this.cartActions.deleteProductFromCard(productName);
  }
}
