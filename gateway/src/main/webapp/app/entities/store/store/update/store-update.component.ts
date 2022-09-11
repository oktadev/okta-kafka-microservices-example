import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { StoreFormService, StoreFormGroup } from './store-form.service';
import { IStore } from '../store.model';
import { StoreService } from '../service/store.service';
import { StoreStatus } from 'app/entities/enumerations/store-status.model';

@Component({
  selector: 'jhi-store-update',
  templateUrl: './store-update.component.html',
})
export class StoreUpdateComponent implements OnInit {
  isSaving = false;
  store: IStore | null = null;
  storeStatusValues = Object.keys(StoreStatus);

  editForm: StoreFormGroup = this.storeFormService.createStoreFormGroup();

  constructor(
    protected storeService: StoreService,
    protected storeFormService: StoreFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ store }) => {
      this.store = store;
      if (store) {
        this.updateForm(store);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const store = this.storeFormService.getStore(this.editForm);
    if (store.id !== null) {
      this.subscribeToSaveResponse(this.storeService.update(store));
    } else {
      this.subscribeToSaveResponse(this.storeService.create(store));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStore>>): void {
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

  protected updateForm(store: IStore): void {
    this.store = store;
    this.storeFormService.resetForm(this.editForm, store);
  }
}
