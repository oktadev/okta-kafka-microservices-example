import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../store.test-samples';

import { StoreFormService } from './store-form.service';

describe('Store Form Service', () => {
  let service: StoreFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreFormService);
  });

  describe('Service methods', () => {
    describe('createStoreFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStoreFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            address: expect.any(Object),
            status: expect.any(Object),
            createTimestamp: expect.any(Object),
            updateTimestamp: expect.any(Object),
          })
        );
      });

      it('passing IStore should create a new form with FormGroup', () => {
        const formGroup = service.createStoreFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            address: expect.any(Object),
            status: expect.any(Object),
            createTimestamp: expect.any(Object),
            updateTimestamp: expect.any(Object),
          })
        );
      });
    });

    describe('getStore', () => {
      it('should return NewStore for default Store initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createStoreFormGroup(sampleWithNewData);

        const store = service.getStore(formGroup) as any;

        expect(store).toMatchObject(sampleWithNewData);
      });

      it('should return NewStore for empty Store initial value', () => {
        const formGroup = service.createStoreFormGroup();

        const store = service.getStore(formGroup) as any;

        expect(store).toMatchObject({});
      });

      it('should return IStore', () => {
        const formGroup = service.createStoreFormGroup(sampleWithRequiredData);

        const store = service.getStore(formGroup) as any;

        expect(store).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStore should not enable id FormControl', () => {
        const formGroup = service.createStoreFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStore should disable id FormControl', () => {
        const formGroup = service.createStoreFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
