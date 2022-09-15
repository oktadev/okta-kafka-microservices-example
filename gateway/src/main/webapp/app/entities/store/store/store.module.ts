import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StoreComponent } from './list/store.component';
import { StoreDetailComponent } from './detail/store-detail.component';
import { StoreUpdateComponent } from './update/store-update.component';
import { StoreDeleteDialogComponent } from './delete/store-delete-dialog.component';
import { StoreRoutingModule } from './route/store-routing.module';

@NgModule({
  imports: [SharedModule, StoreRoutingModule],
  declarations: [StoreComponent, StoreDetailComponent, StoreUpdateComponent, StoreDeleteDialogComponent],
})
export class StoreStoreModule {}
