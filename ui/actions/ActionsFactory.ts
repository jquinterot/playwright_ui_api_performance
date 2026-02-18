import { Page } from '@playwright/test';
import { HomeActions } from './HomeActions';
import { ProductActions } from './ProductActions';
import { CartActions } from './CartActions';
import { AboutUsActions } from './AboutUsActions';
import { ContactActions } from './ContactActions';
import { SingUpActions } from './SignUpActions';
import { PlaceOrderActions } from './PlaceOrderActions';
import { CommonActions } from './CommonActions';
import { HomePage } from '@pages/HomePage';
import { ProductPage } from '@pages/ProductPage';
import { CartPage } from '@pages/CartPage';
import { AboutUsPage } from '@pages/AboutUsPage';
import { ContactPage } from '@pages/ContactPage';
import { SignUpPage } from '@pages/SignUpPage';
import { PlaceOrderPage } from '@pages/PlaceOrderPage';
import { CommonPage } from '@pages/CommonPage';

export class ActionFactory {
  private homePage: HomePage;
  private productPage: ProductPage;
  private cartPage: CartPage;
  private aboutUsPage: AboutUsPage;
  private contactPage: ContactPage;
  private signUpPage: SignUpPage;
  private placeOrderPage: PlaceOrderPage;
  private commonPage: CommonPage;

  constructor(private page: Page) {
    this.homePage = new HomePage(page);
    this.productPage = new ProductPage(page);
    this.cartPage = new CartPage(page);
    this.aboutUsPage = new AboutUsPage(page);
    this.contactPage = new ContactPage(page);
    this.signUpPage = new SignUpPage(page);
    this.placeOrderPage = new PlaceOrderPage(page);
    this.commonPage = new CommonPage(page);
  }

  createHomeActions(): HomeActions {
    return new HomeActions(this.page, this.homePage);
  }

  createProductActions(): ProductActions {
    return new ProductActions(this.page, this.productPage);
  }

  createCartActions(): CartActions {
    return new CartActions(this.page, this.cartPage);
  }

  createAboutUsActions(): AboutUsActions {
    return new AboutUsActions(this.page, this.aboutUsPage);
  }

  createContactActions(): ContactActions {
    return new ContactActions(this.page, this.contactPage);
  }

  createSingUpActions(): SingUpActions {
    return new SingUpActions(this.page, this.signUpPage);
  }

  createPlaceOrderActions(): PlaceOrderActions {
    return new PlaceOrderActions(this.page, this.placeOrderPage);
  }

  createCommonActions(): CommonActions {
    return new CommonActions(this.page, this.commonPage);
  }
}
