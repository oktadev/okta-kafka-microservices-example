import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IStore, NewStore } from '../store.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStore for edit and NewStoreFormGroupInput for create.
 */
type StoreFormGroupInput = IStore | PartialWithRequiredKeyOf<NewStore>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IStore | NewStore> = Omit<T, 'createTimestamp' | 'updateTimestamp'> & {
  createTimestamp?: string | null;
  updateTimestamp?: string | null;
};

type StoreFormRawValue = FormValueOf<IStore>;

type NewStoreFormRawValue = FormValueOf<NewStore>;

type StoreFormDefaults = Pick<NewStore, 'id' | 'createTimestamp' | 'updateTimestamp'>;

type StoreFormGroupContent = {
  id: FormControl<StoreFormRawValue['id'] | NewStore['id']>;
  name: FormControl<StoreFormRawValue['name']>;
  address: FormControl<StoreFormRawValue['address']>;
  status: FormControl<StoreFormRawValue['status']>;
  createTimestamp: FormControl<StoreFormRawValue['createTimestamp']>;
  updateTimestamp: FormControl<StoreFormRawValue['updateTimestamp']>;
};

export type StoreFormGroup = FormGroup<StoreFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StoreFormService {
  createStoreFormGroup(store: StoreFormGroupInput = { id: null }): StoreFormGroup {
    const storeRawValue = this.convertStoreToStoreRawValue({
      ...this.getFormDefaults(),
      ...store,
    });
    return new FormGroup<StoreFormGroupContent>({
      id: new FormControl(
        { value: storeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(storeRawValue.name, {
        validators: [Validators.required],
      }),
      address: new FormControl(storeRawValue.address, {
        validators: [Validators.required],
      }),
      status: new FormControl(storeRawValue.status),
      createTimestamp: new FormControl(storeRawValue.createTimestamp, {
        validators: [Validators.required],
      }),
      updateTimestamp: new FormControl(storeRawValue.updateTimestamp),
    });
  }

  getStore(form: StoreFormGroup): IStore | NewStore {
    return this.convertStoreRawValueToStore(form.getRawValue() as StoreFormRawValue | NewStoreFormRawValue);
  }

  resetForm(form: StoreFormGroup, store: StoreFormGroupInput): void {
    const storeRawValue = this.convertStoreToStoreRawValue({ ...this.getFormDefaults(), ...store });
    form.reset(
      {
        ...storeRawValue,
        id: { value: storeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): StoreFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createTimestamp: currentTime,
      updateTimestamp: currentTime,
    };
  }

  private convertStoreRawValueToStore(rawStore: StoreFormRawValue | NewStoreFormRawValue): IStore | NewStore {
    return {
      ...rawStore,
      createTimestamp: dayjs(rawStore.createTimestamp, DATE_TIME_FORMAT),
      updateTimestamp: dayjs(rawStore.updateTimestamp, DATE_TIME_FORMAT),
    };
  }

  private convertStoreToStoreRawValue(
    store: IStore | (Partial<NewStore> & StoreFormDefaults)
  ): StoreFormRawValue | PartialWithRequiredKeyOf<NewStoreFormRawValue> {
    return {
      ...store,
      createTimestamp: store.createTimestamp ? store.createTimestamp.format(DATE_TIME_FORMAT) : undefined,
      updateTimestamp: store.updateTimestamp ? store.updateTimestamp.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
