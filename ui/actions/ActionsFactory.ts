import { Page } from '@playwright/test';
import { HomeActions } from './HomeActions';
import { ProductActions } from './ProductActions';
import { CartActions } from './CartActions';
import { AboutUsActions } from './AboutUsActions';
import { ContactActions } from './ContactActions';
import { SignUpActions } from './SignUpActions';
import { PlaceOrderActions } from './PlaceOrderActions';
import { CommonActions } from './CommonActions';
import { LoginActions } from './LoginActions';
import { HomePage } from '@pages/HomePage';
import { ProductPage } from '@pages/ProductPage';
import { CartPage } from '@pages/CartPage';
import { AboutUsPage } from '@pages/AboutUsPage';
import { ContactPage } from '@pages/ContactPage';
import { SignUpPage } from '@pages/SignUpPage';
import { PlaceOrderPage } from '@pages/PlaceOrderPage';
import { CommonPage } from '@pages/CommonPage';
import { LoginPage } from '@pages/LoginPage';

export class ActionFactory {
  // Lazy initialization - pages are only created when accessed
  // Previous: all 8 pages were created in constructor, even if unused
  private _homePage?: HomePage;
  private _productPage?: ProductPage;
  private _cartPage?: CartPage;
  private _aboutUsPage?: AboutUsPage;
  private _contactPage?: ContactPage;
  private _signUpPage?: SignUpPage;
  private _placeOrderPage?: PlaceOrderPage;
  private _commonPage?: CommonPage;
  private _loginPage?: LoginPage;

  constructor(private page: Page) {}

  // Lazy-loaded page objects
  private get homePage(): HomePage {
    return (this._homePage ??= new HomePage(this.page));
  }

  private get productPage(): ProductPage {
    return (this._productPage ??= new ProductPage(this.page));
  }

  private get cartPage(): CartPage {
    return (this._cartPage ??= new CartPage(this.page));
  }

  private get aboutUsPage(): AboutUsPage {
    return (this._aboutUsPage ??= new AboutUsPage(this.page));
  }

  private get contactPage(): ContactPage {
    return (this._contactPage ??= new ContactPage(this.page));
  }

  private get signUpPage(): SignUpPage {
    return (this._signUpPage ??= new SignUpPage(this.page));
  }

  private get placeOrderPage(): PlaceOrderPage {
    return (this._placeOrderPage ??= new PlaceOrderPage(this.page));
  }

  private get commonPage(): CommonPage {
    return (this._commonPage ??= new CommonPage(this.page));
  }

  private get loginPage(): LoginPage {
    return (this._loginPage ??= new LoginPage(this.page));
  }

  createHomeActions(): HomeActions {
    // Now only passes PageObject, not Page + PageObject (reduced redundancy)
    return new HomeActions(this.homePage);
  }

  createProductActions(): ProductActions {
    return new ProductActions(this.productPage);
  }

  createCartActions(): CartActions {
    return new CartActions(this.cartPage);
  }

  createAboutUsActions(): AboutUsActions {
    return new AboutUsActions(this.aboutUsPage);
  }

  createContactActions(): ContactActions {
    return new ContactActions(this.contactPage);
  }

  createSignUpActions(): SignUpActions {
    return new SignUpActions(this.signUpPage);
  }

  createPlaceOrderActions(): PlaceOrderActions {
    return new PlaceOrderActions(this.placeOrderPage);
  }

  createCommonActions(): CommonActions {
    return new CommonActions(this.commonPage);
  }

  createLoginActions(): LoginActions {
    return new LoginActions(this.loginPage);
  }
}
