import { element, by, ElementFinder } from 'protractor';

export class StoreComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-store div table .btn-danger'));
  title = element.all(by.css('jhi-store div h2#page-heading span')).first();

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class StoreUpdatePage {
  pageTitle = element(by.id('jhi-store-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  nameInput = element(by.id('field_name'));
  addressInput = element(by.id('field_address'));
  statusSelect = element(by.id('field_status'));
  createTimestampInput = element(by.id('field_createTimestamp'));
  updateTimestampInput = element(by.id('field_updateTimestamp'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getAttribute('value');
  }

  async setAddressInput(address: string): Promise<void> {
    await this.addressInput.sendKeys(address);
  }

  async getAddressInput(): Promise<string> {
    return await this.addressInput.getAttribute('value');
  }

  async setStatusSelect(status: string): Promise<void> {
    await this.statusSelect.sendKeys(status);
  }

  async getStatusSelect(): Promise<string> {
    return await this.statusSelect.element(by.css('option:checked')).getText();
  }

  async statusSelectLastOption(): Promise<void> {
    await this.statusSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async setCreateTimestampInput(createTimestamp: string): Promise<void> {
    await this.createTimestampInput.sendKeys(createTimestamp);
  }

  async getCreateTimestampInput(): Promise<string> {
    return await this.createTimestampInput.getAttribute('value');
  }

  async setUpdateTimestampInput(updateTimestamp: string): Promise<void> {
    await this.updateTimestampInput.sendKeys(updateTimestamp);
  }

  async getUpdateTimestampInput(): Promise<string> {
    return await this.updateTimestampInput.getAttribute('value');
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class StoreDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-store-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-store'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
