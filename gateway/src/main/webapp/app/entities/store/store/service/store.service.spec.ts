import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStore } from '../store.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../store.test-samples';

import { StoreService, RestStore } from './store.service';

const requireRestSample: RestStore = {
  ...sampleWithRequiredData,
  createTimestamp: sampleWithRequiredData.createTimestamp?.toJSON(),
  updateTimestamp: sampleWithRequiredData.updateTimestamp?.toJSON(),
};

describe('Store Service', () => {
  let service: StoreService;
  let httpMock: HttpTestingController;
  let expectedResult: IStore | IStore[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Store', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const store = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(store).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Store', () => {
      const store = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(store).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Store', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Store', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Store', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addStoreToCollectionIfMissing', () => {
      it('should add a Store to an empty array', () => {
        const store: IStore = sampleWithRequiredData;
        expectedResult = service.addStoreToCollectionIfMissing([], store);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(store);
      });

      it('should not add a Store to an array that contains it', () => {
        const store: IStore = sampleWithRequiredData;
        const storeCollection: IStore[] = [
          {
            ...store,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStoreToCollectionIfMissing(storeCollection, store);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Store to an array that doesn't contain it", () => {
        const store: IStore = sampleWithRequiredData;
        const storeCollection: IStore[] = [sampleWithPartialData];
        expectedResult = service.addStoreToCollectionIfMissing(storeCollection, store);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(store);
      });

      it('should add only unique Store to an array', () => {
        const storeArray: IStore[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const storeCollection: IStore[] = [sampleWithRequiredData];
        expectedResult = service.addStoreToCollectionIfMissing(storeCollection, ...storeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const store: IStore = sampleWithRequiredData;
        const store2: IStore = sampleWithPartialData;
        expectedResult = service.addStoreToCollectionIfMissing([], store, store2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(store);
        expect(expectedResult).toContain(store2);
      });

      it('should accept null and undefined values', () => {
        const store: IStore = sampleWithRequiredData;
        expectedResult = service.addStoreToCollectionIfMissing([], null, store, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(store);
      });

      it('should return initial array if no Store is added', () => {
        const storeCollection: IStore[] = [sampleWithRequiredData];
        expectedResult = service.addStoreToCollectionIfMissing(storeCollection, undefined, null);
        expect(expectedResult).toEqual(storeCollection);
      });
    });

    describe('compareStore', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStore(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareStore(entity1, entity2);
        const compareResult2 = service.compareStore(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareStore(entity1, entity2);
        const compareResult2 = service.compareStore(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareStore(entity1, entity2);
        const compareResult2 = service.compareStore(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
