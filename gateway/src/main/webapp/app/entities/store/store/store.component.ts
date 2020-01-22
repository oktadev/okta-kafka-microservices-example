import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IStore } from 'app/shared/model/store/store.model';
import { StoreService } from './store.service';
import { StoreDeleteDialogComponent } from './store-delete-dialog.component';

@Component({
  selector: 'jhi-store',
  templateUrl: './store.component.html'
})
export class StoreComponent implements OnInit, OnDestroy {
  stores?: IStore[];
  eventSubscriber?: Subscription;

  constructor(protected storeService: StoreService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.storeService.query().subscribe((res: HttpResponse<IStore[]>) => {
      this.stores = res.body ? res.body : [];
    });
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInStores();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IStore): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInStores(): void {
    this.eventSubscriber = this.eventManager.subscribe('storeListModification', () => this.loadAll());
  }

  delete(store: IStore): void {
    const modalRef = this.modalService.open(StoreDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.store = store;
  }
}
