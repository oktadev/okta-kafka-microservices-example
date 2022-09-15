import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStore, NewStore } from '../store.model';

export type PartialUpdateStore = Partial<IStore> & Pick<IStore, 'id'>;

type RestOf<T extends IStore | NewStore> = Omit<T, 'createTimestamp' | 'updateTimestamp'> & {
  createTimestamp?: string | null;
  updateTimestamp?: string | null;
};

export type RestStore = RestOf<IStore>;

export type NewRestStore = RestOf<NewStore>;

export type PartialUpdateRestStore = RestOf<PartialUpdateStore>;

export type EntityResponseType = HttpResponse<IStore>;
export type EntityArrayResponseType = HttpResponse<IStore[]>;

@Injectable({ providedIn: 'root' })
export class StoreService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/stores', 'store');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(store: NewStore): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(store);
    return this.http.post<RestStore>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(store: IStore): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(store);
    return this.http
      .put<RestStore>(`${this.resourceUrl}/${this.getStoreIdentifier(store)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(store: PartialUpdateStore): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(store);
    return this.http
      .patch<RestStore>(`${this.resourceUrl}/${this.getStoreIdentifier(store)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestStore>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestStore[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStoreIdentifier(store: Pick<IStore, 'id'>): number {
    return store.id;
  }

  compareStore(o1: Pick<IStore, 'id'> | null, o2: Pick<IStore, 'id'> | null): boolean {
    return o1 && o2 ? this.getStoreIdentifier(o1) === this.getStoreIdentifier(o2) : o1 === o2;
  }

  addStoreToCollectionIfMissing<Type extends Pick<IStore, 'id'>>(
    storeCollection: Type[],
    ...storesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const stores: Type[] = storesToCheck.filter(isPresent);
    if (stores.length > 0) {
      const storeCollectionIdentifiers = storeCollection.map(storeItem => this.getStoreIdentifier(storeItem)!);
      const storesToAdd = stores.filter(storeItem => {
        const storeIdentifier = this.getStoreIdentifier(storeItem);
        if (storeCollectionIdentifiers.includes(storeIdentifier)) {
          return false;
        }
        storeCollectionIdentifiers.push(storeIdentifier);
        return true;
      });
      return [...storesToAdd, ...storeCollection];
    }
    return storeCollection;
  }

  protected convertDateFromClient<T extends IStore | NewStore | PartialUpdateStore>(store: T): RestOf<T> {
    return {
      ...store,
      createTimestamp: store.createTimestamp?.toJSON() ?? null,
      updateTimestamp: store.updateTimestamp?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restStore: RestStore): IStore {
    return {
      ...restStore,
      createTimestamp: restStore.createTimestamp ? dayjs(restStore.createTimestamp) : undefined,
      updateTimestamp: restStore.updateTimestamp ? dayjs(restStore.updateTimestamp) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestStore>): HttpResponse<IStore> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestStore[]>): HttpResponse<IStore[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
