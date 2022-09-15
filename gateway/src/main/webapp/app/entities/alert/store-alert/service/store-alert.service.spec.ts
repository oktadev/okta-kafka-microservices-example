import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStoreAlert } from '../store-alert.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../store-alert.test-samples';

import { StoreAlertService, RestStoreAlert } from './store-alert.service';

const requireRestSample: RestStoreAlert = {
  ...sampleWithRequiredData,
  timestamp: sampleWithRequiredData.timestamp?.toJSON(),
};

describe('StoreAlert Service', () => {
  let service: StoreAlertService;
  let httpMock: HttpTestingController;
  let expectedResult: IStoreAlert | IStoreAlert[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StoreAlertService);
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

    it('should create a StoreAlert', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const storeAlert = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(storeAlert).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a StoreAlert', () => {
      const storeAlert = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(storeAlert).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a StoreAlert', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of StoreAlert', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a StoreAlert', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addStoreAlertToCollectionIfMissing', () => {
      it('should add a StoreAlert to an empty array', () => {
        const storeAlert: IStoreAlert = sampleWithRequiredData;
        expectedResult = service.addStoreAlertToCollectionIfMissing([], storeAlert);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(storeAlert);
      });

      it('should not add a StoreAlert to an array that contains it', () => {
        const storeAlert: IStoreAlert = sampleWithRequiredData;
        const storeAlertCollection: IStoreAlert[] = [
          {
            ...storeAlert,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStoreAlertToCollectionIfMissing(storeAlertCollection, storeAlert);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a StoreAlert to an array that doesn't contain it", () => {
        const storeAlert: IStoreAlert = sampleWithRequiredData;
        const storeAlertCollection: IStoreAlert[] = [sampleWithPartialData];
        expectedResult = service.addStoreAlertToCollectionIfMissing(storeAlertCollection, storeAlert);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(storeAlert);
      });

      it('should add only unique StoreAlert to an array', () => {
        const storeAlertArray: IStoreAlert[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const storeAlertCollection: IStoreAlert[] = [sampleWithRequiredData];
        expectedResult = service.addStoreAlertToCollectionIfMissing(storeAlertCollection, ...storeAlertArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const storeAlert: IStoreAlert = sampleWithRequiredData;
        const storeAlert2: IStoreAlert = sampleWithPartialData;
        expectedResult = service.addStoreAlertToCollectionIfMissing([], storeAlert, storeAlert2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(storeAlert);
        expect(expectedResult).toContain(storeAlert2);
      });

      it('should accept null and undefined values', () => {
        const storeAlert: IStoreAlert = sampleWithRequiredData;
        expectedResult = service.addStoreAlertToCollectionIfMissing([], null, storeAlert, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(storeAlert);
      });

      it('should return initial array if no StoreAlert is added', () => {
        const storeAlertCollection: IStoreAlert[] = [sampleWithRequiredData];
        expectedResult = service.addStoreAlertToCollectionIfMissing(storeAlertCollection, undefined, null);
        expect(expectedResult).toEqual(storeAlertCollection);
      });
    });

    describe('compareStoreAlert', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStoreAlert(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareStoreAlert(entity1, entity2);
        const compareResult2 = service.compareStoreAlert(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareStoreAlert(entity1, entity2);
        const compareResult2 = service.compareStoreAlert(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareStoreAlert(entity1, entity2);
        const compareResult2 = service.compareStoreAlert(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
