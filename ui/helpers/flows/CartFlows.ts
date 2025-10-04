import { ActionFactory } from '../../actions/ActionsFactory';
import { Phones } from '../enums/Phones/Phones';
import { PhonePrices } from '../enums/Phones/PhonePrices';
import { Categories } from '../enums/Categories';
import { Monitors } from '../enums/Monitors/Monitors';
import { MonitorPrices } from '../enums/Monitors/MonitorPrices';

export class CartFlows {
  static async addProductToCart(
    actionFactory: ActionFactory,
    product: Phones,
    price: PhonePrices
  ) {
    const homeActions = actionFactory.createHomeActions();
    await homeActions.selectCategory(Categories.PHONES);
    await homeActions.selectProduct(product);

    const productActions = actionFactory.createProductActions();
    await productActions.checkAddedProduct(product);
    await productActions.checkProductPrice(price);
    await productActions.addToCart();
  }

  static async addMonitorToCart(
    actionFactory: ActionFactory,
    monitor: Monitors,
    price: MonitorPrices
  ) {
    const homeActions = actionFactory.createHomeActions();
    await homeActions.selectCategory(Categories.MONITORS);
    await homeActions.selectProduct(monitor);

    const productActions = actionFactory.createProductActions();
    await productActions.checkAddedProduct(monitor);
    await productActions.checkProductPrice(price);
    await productActions.addToCart();
  }
}