import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStoreAlert } from '../store-alert.model';

@Component({
  selector: 'jhi-store-alert-detail',
  templateUrl: './store-alert-detail.component.html',
})
export class StoreAlertDetailComponent implements OnInit {
  storeAlert: IStoreAlert | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ storeAlert }) => {
      this.storeAlert = storeAlert;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
