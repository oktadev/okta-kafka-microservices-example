import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IStoreAlert, StoreAlert } from 'app/shared/model/alert/store-alert.model';
import { StoreAlertService } from './store-alert.service';
import { StoreAlertComponent } from './store-alert.component';
import { StoreAlertDetailComponent } from './store-alert-detail.component';
import { StoreAlertUpdateComponent } from './store-alert-update.component';

@Injectable({ providedIn: 'root' })
export class StoreAlertResolve implements Resolve<IStoreAlert> {
  constructor(private service: StoreAlertService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStoreAlert> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((storeAlert: HttpResponse<StoreAlert>) => {
          if (storeAlert.body) {
            return of(storeAlert.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new StoreAlert());
  }
}

export const storeAlertRoute: Routes = [
  {
    path: '',
    component: StoreAlertComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.alertStoreAlert.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: StoreAlertDetailComponent,
    resolve: {
      storeAlert: StoreAlertResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.alertStoreAlert.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: StoreAlertUpdateComponent,
    resolve: {
      storeAlert: StoreAlertResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.alertStoreAlert.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: StoreAlertUpdateComponent,
    resolve: {
      storeAlert: StoreAlertResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.alertStoreAlert.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
