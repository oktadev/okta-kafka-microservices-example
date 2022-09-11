import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStore } from '../store.model';

@Component({
  selector: 'jhi-store-detail',
  templateUrl: './store-detail.component.html',
})
export class StoreDetailComponent implements OnInit {
  store: IStore | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ store }) => {
      this.store = store;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
