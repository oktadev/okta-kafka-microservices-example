import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStoreAlert } from '../store-alert.model';
import { StoreAlertService } from '../service/store-alert.service';

@Injectable({ providedIn: 'root' })
export class StoreAlertRoutingResolveService implements Resolve<IStoreAlert | null> {
  constructor(protected service: StoreAlertService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStoreAlert | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((storeAlert: HttpResponse<IStoreAlert>) => {
          if (storeAlert.body) {
            return of(storeAlert.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
