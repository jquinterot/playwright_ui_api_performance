import { PlaceOrderPage } from '@pages/PlaceOrderPage';
import { expect, Page } from '@playwright/test';

export class PlaceOrderActions {
  // Simplified constructor - PageObject already has access to page internally
  // Previous: passed both `page` and `placeOrderPage`, causing redundancy
  constructor(private readonly placeOrderPage: PlaceOrderPage) {}

  get page(): Page {
    return this.placeOrderPage.getPage();
  }

  async fillName(name: string) {
    await this.placeOrderPage.getNameInput().isVisible();
    await this.placeOrderPage.getNameInput().fill(name);
  }

  async fillCountry(country: string) {
    await this.placeOrderPage.getCountryInput().isVisible();
    await this.placeOrderPage.getCountryInput().fill(country);
  }

  async fillCity(city: string) {
    await this.placeOrderPage.getCityInput().fill(city);
  }

  async fillCard(cardNumber: string) {
    await this.placeOrderPage.getCardInput().fill(cardNumber);
  }

  async fillMonth(month: string) {
    await this.placeOrderPage.getMonthInput().fill(month);
  }

  async fillYear(year: string) {
    await this.placeOrderPage.getYearInput().fill(year);
  }

  async selectPurchase() {
    await this.placeOrderPage.getPurchaseButton().click();
  }

  async isThankYouMessageIsDisplayed() {
    await expect(this.placeOrderPage.getThankYouLabel()).toBeVisible();
  }
}
