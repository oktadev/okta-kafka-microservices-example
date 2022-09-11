import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../store-alert.test-samples';

import { StoreAlertFormService } from './store-alert-form.service';

describe('StoreAlert Form Service', () => {
  let service: StoreAlertFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreAlertFormService);
  });

  describe('Service methods', () => {
    describe('createStoreAlertFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStoreAlertFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            storeName: expect.any(Object),
            storeStatus: expect.any(Object),
            timestamp: expect.any(Object),
          })
        );
      });

      it('passing IStoreAlert should create a new form with FormGroup', () => {
        const formGroup = service.createStoreAlertFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            storeName: expect.any(Object),
            storeStatus: expect.any(Object),
            timestamp: expect.any(Object),
          })
        );
      });
    });

    describe('getStoreAlert', () => {
      it('should return NewStoreAlert for default StoreAlert initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createStoreAlertFormGroup(sampleWithNewData);

        const storeAlert = service.getStoreAlert(formGroup) as any;

        expect(storeAlert).toMatchObject(sampleWithNewData);
      });

      it('should return NewStoreAlert for empty StoreAlert initial value', () => {
        const formGroup = service.createStoreAlertFormGroup();

        const storeAlert = service.getStoreAlert(formGroup) as any;

        expect(storeAlert).toMatchObject({});
      });

      it('should return IStoreAlert', () => {
        const formGroup = service.createStoreAlertFormGroup(sampleWithRequiredData);

        const storeAlert = service.getStoreAlert(formGroup) as any;

        expect(storeAlert).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStoreAlert should not enable id FormControl', () => {
        const formGroup = service.createStoreAlertFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStoreAlert should disable id FormControl', () => {
        const formGroup = service.createStoreAlertFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
