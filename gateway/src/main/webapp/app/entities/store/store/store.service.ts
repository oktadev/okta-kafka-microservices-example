import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IStore } from 'app/shared/model/store/store.model';

type EntityResponseType = HttpResponse<IStore>;
type EntityArrayResponseType = HttpResponse<IStore[]>;

@Injectable({ providedIn: 'root' })
export class StoreService {
  public resourceUrl = SERVER_API_URL + 'services/store/api/stores';

  constructor(protected http: HttpClient) {}

  create(store: IStore): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(store);
    return this.http
      .post<IStore>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(store: IStore): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(store);
    return this.http
      .put<IStore>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IStore>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IStore[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(store: IStore): IStore {
    const copy: IStore = Object.assign({}, store, {
      createTimestamp: store.createTimestamp && store.createTimestamp.isValid() ? store.createTimestamp.toJSON() : undefined,
      updateTimestamp: store.updateTimestamp && store.updateTimestamp.isValid() ? store.updateTimestamp.toJSON() : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createTimestamp = res.body.createTimestamp ? moment(res.body.createTimestamp) : undefined;
      res.body.updateTimestamp = res.body.updateTimestamp ? moment(res.body.updateTimestamp) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((store: IStore) => {
        store.createTimestamp = store.createTimestamp ? moment(store.createTimestamp) : undefined;
        store.updateTimestamp = store.updateTimestamp ? moment(store.updateTimestamp) : undefined;
      });
    }
    return res;
  }
}
