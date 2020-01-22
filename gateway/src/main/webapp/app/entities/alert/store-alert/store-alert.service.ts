import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IStoreAlert } from 'app/shared/model/alert/store-alert.model';

type EntityResponseType = HttpResponse<IStoreAlert>;
type EntityArrayResponseType = HttpResponse<IStoreAlert[]>;

@Injectable({ providedIn: 'root' })
export class StoreAlertService {
  public resourceUrl = SERVER_API_URL + 'services/alert/api/store-alerts';

  constructor(protected http: HttpClient) {}

  create(storeAlert: IStoreAlert): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(storeAlert);
    return this.http
      .post<IStoreAlert>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(storeAlert: IStoreAlert): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(storeAlert);
    return this.http
      .put<IStoreAlert>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IStoreAlert>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IStoreAlert[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(storeAlert: IStoreAlert): IStoreAlert {
    const copy: IStoreAlert = Object.assign({}, storeAlert, {
      timestamp: storeAlert.timestamp && storeAlert.timestamp.isValid() ? storeAlert.timestamp.toJSON() : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.timestamp = res.body.timestamp ? moment(res.body.timestamp) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((storeAlert: IStoreAlert) => {
        storeAlert.timestamp = storeAlert.timestamp ? moment(storeAlert.timestamp) : undefined;
      });
    }
    return res;
  }
}
