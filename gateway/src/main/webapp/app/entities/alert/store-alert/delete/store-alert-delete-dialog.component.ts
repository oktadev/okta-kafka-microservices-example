import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStoreAlert } from '../store-alert.model';
import { StoreAlertService } from '../service/store-alert.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './store-alert-delete-dialog.component.html',
})
export class StoreAlertDeleteDialogComponent {
  storeAlert?: IStoreAlert;

  constructor(protected storeAlertService: StoreAlertService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.storeAlertService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
