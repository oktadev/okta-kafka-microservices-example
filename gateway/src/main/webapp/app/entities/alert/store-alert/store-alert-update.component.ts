import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IStoreAlert, StoreAlert } from 'app/shared/model/alert/store-alert.model';
import { StoreAlertService } from './store-alert.service';

@Component({
  selector: 'jhi-store-alert-update',
  templateUrl: './store-alert-update.component.html'
})
export class StoreAlertUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    storeName: [null, [Validators.required]],
    storeStatus: [null, [Validators.required]],
    timestamp: [null, [Validators.required]]
  });

  constructor(protected storeAlertService: StoreAlertService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ storeAlert }) => {
      this.updateForm(storeAlert);
    });
  }

  updateForm(storeAlert: IStoreAlert): void {
    this.editForm.patchValue({
      id: storeAlert.id,
      storeName: storeAlert.storeName,
      storeStatus: storeAlert.storeStatus,
      timestamp: storeAlert.timestamp != null ? storeAlert.timestamp.format(DATE_TIME_FORMAT) : null
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const storeAlert = this.createFromForm();
    if (storeAlert.id !== undefined) {
      this.subscribeToSaveResponse(this.storeAlertService.update(storeAlert));
    } else {
      this.subscribeToSaveResponse(this.storeAlertService.create(storeAlert));
    }
  }

  private createFromForm(): IStoreAlert {
    return {
      ...new StoreAlert(),
      id: this.editForm.get(['id'])!.value,
      storeName: this.editForm.get(['storeName'])!.value,
      storeStatus: this.editForm.get(['storeStatus'])!.value,
      timestamp:
        this.editForm.get(['timestamp'])!.value != null ? moment(this.editForm.get(['timestamp'])!.value, DATE_TIME_FORMAT) : undefined
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStoreAlert>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
