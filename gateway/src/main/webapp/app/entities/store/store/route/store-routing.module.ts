import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StoreComponent } from '../list/store.component';
import { StoreDetailComponent } from '../detail/store-detail.component';
import { StoreUpdateComponent } from '../update/store-update.component';
import { StoreRoutingResolveService } from './store-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const storeRoute: Routes = [
  {
    path: '',
    component: StoreComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StoreDetailComponent,
    resolve: {
      store: StoreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StoreUpdateComponent,
    resolve: {
      store: StoreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StoreUpdateComponent,
    resolve: {
      store: StoreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(storeRoute)],
  exports: [RouterModule],
})
export class StoreRoutingModule {}
