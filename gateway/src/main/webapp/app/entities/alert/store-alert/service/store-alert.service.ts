import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStoreAlert, NewStoreAlert } from '../store-alert.model';

export type PartialUpdateStoreAlert = Partial<IStoreAlert> & Pick<IStoreAlert, 'id'>;

type RestOf<T extends IStoreAlert | NewStoreAlert> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

export type RestStoreAlert = RestOf<IStoreAlert>;

export type NewRestStoreAlert = RestOf<NewStoreAlert>;

export type PartialUpdateRestStoreAlert = RestOf<PartialUpdateStoreAlert>;

export type EntityResponseType = HttpResponse<IStoreAlert>;
export type EntityArrayResponseType = HttpResponse<IStoreAlert[]>;

@Injectable({ providedIn: 'root' })
export class StoreAlertService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/store-alerts', 'alert');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(storeAlert: NewStoreAlert): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(storeAlert);
    return this.http
      .post<RestStoreAlert>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(storeAlert: IStoreAlert): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(storeAlert);
    return this.http
      .put<RestStoreAlert>(`${this.resourceUrl}/${this.getStoreAlertIdentifier(storeAlert)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(storeAlert: PartialUpdateStoreAlert): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(storeAlert);
    return this.http
      .patch<RestStoreAlert>(`${this.resourceUrl}/${this.getStoreAlertIdentifier(storeAlert)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestStoreAlert>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestStoreAlert[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStoreAlertIdentifier(storeAlert: Pick<IStoreAlert, 'id'>): number {
    return storeAlert.id;
  }

  compareStoreAlert(o1: Pick<IStoreAlert, 'id'> | null, o2: Pick<IStoreAlert, 'id'> | null): boolean {
    return o1 && o2 ? this.getStoreAlertIdentifier(o1) === this.getStoreAlertIdentifier(o2) : o1 === o2;
  }

  addStoreAlertToCollectionIfMissing<Type extends Pick<IStoreAlert, 'id'>>(
    storeAlertCollection: Type[],
    ...storeAlertsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const storeAlerts: Type[] = storeAlertsToCheck.filter(isPresent);
    if (storeAlerts.length > 0) {
      const storeAlertCollectionIdentifiers = storeAlertCollection.map(storeAlertItem => this.getStoreAlertIdentifier(storeAlertItem)!);
      const storeAlertsToAdd = storeAlerts.filter(storeAlertItem => {
        const storeAlertIdentifier = this.getStoreAlertIdentifier(storeAlertItem);
        if (storeAlertCollectionIdentifiers.includes(storeAlertIdentifier)) {
          return false;
        }
        storeAlertCollectionIdentifiers.push(storeAlertIdentifier);
        return true;
      });
      return [...storeAlertsToAdd, ...storeAlertCollection];
    }
    return storeAlertCollection;
  }

  protected convertDateFromClient<T extends IStoreAlert | NewStoreAlert | PartialUpdateStoreAlert>(storeAlert: T): RestOf<T> {
    return {
      ...storeAlert,
      timestamp: storeAlert.timestamp?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restStoreAlert: RestStoreAlert): IStoreAlert {
    return {
      ...restStoreAlert,
      timestamp: restStoreAlert.timestamp ? dayjs(restStoreAlert.timestamp) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestStoreAlert>): HttpResponse<IStoreAlert> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestStoreAlert[]>): HttpResponse<IStoreAlert[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
