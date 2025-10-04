import { Page } from '@playwright/test';
import { HomeActions } from './HomeActions';
import { ProductActions } from './ProductActions';
import { CartActions } from './CartActions';
import { AboutUsActions } from './AboutUsActions';
import { ContactActions } from './ContactActions';
import { SingUpActions } from './SignUpActions';
import { PlaceOrderActions } from './PlaceOrderActions';

export class ActionFactory {
  constructor(private page: Page) {}

  createHomeActions(): HomeActions {
    return new HomeActions(this.page);
  }

  createProductActions(): ProductActions {
    return new ProductActions(this.page);
  }

  createCartActions(): CartActions {
    return new CartActions(this.page);
  }

  createAboutUsActions(): AboutUsActions {
    return new AboutUsActions(this.page);
  }

  createContactActions(): ContactActions {
    return new ContactActions(this.page);
  }

  createSingUpActions(): SingUpActions {
    return new SingUpActions(this.page);
  }

  createPlaceOrderActions(): PlaceOrderActions {
    return new PlaceOrderActions(this.page);
  }
  
}
