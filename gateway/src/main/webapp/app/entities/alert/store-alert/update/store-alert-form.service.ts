import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IStoreAlert, NewStoreAlert } from '../store-alert.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStoreAlert for edit and NewStoreAlertFormGroupInput for create.
 */
type StoreAlertFormGroupInput = IStoreAlert | PartialWithRequiredKeyOf<NewStoreAlert>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IStoreAlert | NewStoreAlert> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

type StoreAlertFormRawValue = FormValueOf<IStoreAlert>;

type NewStoreAlertFormRawValue = FormValueOf<NewStoreAlert>;

type StoreAlertFormDefaults = Pick<NewStoreAlert, 'id' | 'timestamp'>;

type StoreAlertFormGroupContent = {
  id: FormControl<StoreAlertFormRawValue['id'] | NewStoreAlert['id']>;
  storeName: FormControl<StoreAlertFormRawValue['storeName']>;
  storeStatus: FormControl<StoreAlertFormRawValue['storeStatus']>;
  timestamp: FormControl<StoreAlertFormRawValue['timestamp']>;
};

export type StoreAlertFormGroup = FormGroup<StoreAlertFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StoreAlertFormService {
  createStoreAlertFormGroup(storeAlert: StoreAlertFormGroupInput = { id: null }): StoreAlertFormGroup {
    const storeAlertRawValue = this.convertStoreAlertToStoreAlertRawValue({
      ...this.getFormDefaults(),
      ...storeAlert,
    });
    return new FormGroup<StoreAlertFormGroupContent>({
      id: new FormControl(
        { value: storeAlertRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      storeName: new FormControl(storeAlertRawValue.storeName, {
        validators: [Validators.required],
      }),
      storeStatus: new FormControl(storeAlertRawValue.storeStatus, {
        validators: [Validators.required],
      }),
      timestamp: new FormControl(storeAlertRawValue.timestamp, {
        validators: [Validators.required],
      }),
    });
  }

  getStoreAlert(form: StoreAlertFormGroup): IStoreAlert | NewStoreAlert {
    return this.convertStoreAlertRawValueToStoreAlert(form.getRawValue() as StoreAlertFormRawValue | NewStoreAlertFormRawValue);
  }

  resetForm(form: StoreAlertFormGroup, storeAlert: StoreAlertFormGroupInput): void {
    const storeAlertRawValue = this.convertStoreAlertToStoreAlertRawValue({ ...this.getFormDefaults(), ...storeAlert });
    form.reset(
      {
        ...storeAlertRawValue,
        id: { value: storeAlertRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): StoreAlertFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timestamp: currentTime,
    };
  }

  private convertStoreAlertRawValueToStoreAlert(
    rawStoreAlert: StoreAlertFormRawValue | NewStoreAlertFormRawValue
  ): IStoreAlert | NewStoreAlert {
    return {
      ...rawStoreAlert,
      timestamp: dayjs(rawStoreAlert.timestamp, DATE_TIME_FORMAT),
    };
  }

  private convertStoreAlertToStoreAlertRawValue(
    storeAlert: IStoreAlert | (Partial<NewStoreAlert> & StoreAlertFormDefaults)
  ): StoreAlertFormRawValue | PartialWithRequiredKeyOf<NewStoreAlertFormRawValue> {
    return {
      ...storeAlert,
      timestamp: storeAlert.timestamp ? storeAlert.timestamp.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
