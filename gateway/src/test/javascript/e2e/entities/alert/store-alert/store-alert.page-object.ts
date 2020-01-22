import { element, by, ElementFinder } from 'protractor';

export class StoreAlertComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-store-alert div table .btn-danger'));
  title = element.all(by.css('jhi-store-alert div h2#page-heading span')).first();

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

export class StoreAlertUpdatePage {
  pageTitle = element(by.id('jhi-store-alert-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  storeNameInput = element(by.id('field_storeName'));
  storeStatusInput = element(by.id('field_storeStatus'));
  timestampInput = element(by.id('field_timestamp'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setStoreNameInput(storeName: string): Promise<void> {
    await this.storeNameInput.sendKeys(storeName);
  }

  async getStoreNameInput(): Promise<string> {
    return await this.storeNameInput.getAttribute('value');
  }

  async setStoreStatusInput(storeStatus: string): Promise<void> {
    await this.storeStatusInput.sendKeys(storeStatus);
  }

  async getStoreStatusInput(): Promise<string> {
    return await this.storeStatusInput.getAttribute('value');
  }

  async setTimestampInput(timestamp: string): Promise<void> {
    await this.timestampInput.sendKeys(timestamp);
  }

  async getTimestampInput(): Promise<string> {
    return await this.timestampInput.getAttribute('value');
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

export class StoreAlertDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-storeAlert-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-storeAlert'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
