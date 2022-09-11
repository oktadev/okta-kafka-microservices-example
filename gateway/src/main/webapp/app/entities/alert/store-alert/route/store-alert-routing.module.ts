import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StoreAlertComponent } from '../list/store-alert.component';
import { StoreAlertDetailComponent } from '../detail/store-alert-detail.component';
import { StoreAlertUpdateComponent } from '../update/store-alert-update.component';
import { StoreAlertRoutingResolveService } from './store-alert-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const storeAlertRoute: Routes = [
  {
    path: '',
    component: StoreAlertComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StoreAlertDetailComponent,
    resolve: {
      storeAlert: StoreAlertRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StoreAlertUpdateComponent,
    resolve: {
      storeAlert: StoreAlertRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StoreAlertUpdateComponent,
    resolve: {
      storeAlert: StoreAlertRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(storeAlertRoute)],
  exports: [RouterModule],
})
export class StoreAlertRoutingModule {}
