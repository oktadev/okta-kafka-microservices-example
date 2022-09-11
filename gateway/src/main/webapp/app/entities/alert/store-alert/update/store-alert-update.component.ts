import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { StoreAlertFormService, StoreAlertFormGroup } from './store-alert-form.service';
import { IStoreAlert } from '../store-alert.model';
import { StoreAlertService } from '../service/store-alert.service';

@Component({
  selector: 'jhi-store-alert-update',
  templateUrl: './store-alert-update.component.html',
})
export class StoreAlertUpdateComponent implements OnInit {
  isSaving = false;
  storeAlert: IStoreAlert | null = null;

  editForm: StoreAlertFormGroup = this.storeAlertFormService.createStoreAlertFormGroup();

  constructor(
    protected storeAlertService: StoreAlertService,
    protected storeAlertFormService: StoreAlertFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ storeAlert }) => {
      this.storeAlert = storeAlert;
      if (storeAlert) {
        this.updateForm(storeAlert);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const storeAlert = this.storeAlertFormService.getStoreAlert(this.editForm);
    if (storeAlert.id !== null) {
      this.subscribeToSaveResponse(this.storeAlertService.update(storeAlert));
    } else {
      this.subscribeToSaveResponse(this.storeAlertService.create(storeAlert));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStoreAlert>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(storeAlert: IStoreAlert): void {
    this.storeAlert = storeAlert;
    this.storeAlertFormService.resetForm(this.editForm, storeAlert);
  }
}
