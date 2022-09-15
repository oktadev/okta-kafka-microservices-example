import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StoreAlertComponent } from './list/store-alert.component';
import { StoreAlertDetailComponent } from './detail/store-alert-detail.component';
import { StoreAlertUpdateComponent } from './update/store-alert-update.component';
import { StoreAlertDeleteDialogComponent } from './delete/store-alert-delete-dialog.component';
import { StoreAlertRoutingModule } from './route/store-alert-routing.module';

@NgModule({
  imports: [SharedModule, StoreAlertRoutingModule],
  declarations: [StoreAlertComponent, StoreAlertDetailComponent, StoreAlertUpdateComponent, StoreAlertDeleteDialogComponent],
})
export class AlertStoreAlertModule {}
