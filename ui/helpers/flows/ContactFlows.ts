import { HomeActions } from '@actions/HomeActions';
import { ContactActions } from '@actions/ContactActions';
import { MenuOptions } from '@helpers/enums/MenuOptions';

export class ContactFlows {
  // Extracted from tests - contact form operations

  static async openContactModal(
    homeActions: HomeActions,
    contactActions: ContactActions,
  ): Promise<void> {
    await homeActions.selectMenuOption(MenuOptions.CONTACT);
    await contactActions.verifyContactModalVisible();
  }

  static async fillContactForm(
    contactActions: ContactActions,
    email: string,
    name: string,
    message: string,
  ): Promise<void> {
    await contactActions.fillContactForm(email, name, message);
  }

  static async sendMessage(contactActions: ContactActions): Promise<void> {
    await contactActions.sendMessage();
  }

  static async fullContactFlow(
    homeActions: HomeActions,
    contactActions: ContactActions,
    email: string,
    name: string,
    message: string,
  ): Promise<void> {
    await this.openContactModal(homeActions, contactActions);
    await this.fillContactForm(contactActions, email, name, message);
    await this.sendMessage(contactActions);
  }
}
