import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IStoreAlert } from 'app/shared/model/alert/store-alert.model';
import { StoreAlertService } from './store-alert.service';
import { StoreAlertDeleteDialogComponent } from './store-alert-delete-dialog.component';

@Component({
  selector: 'jhi-store-alert',
  templateUrl: './store-alert.component.html'
})
export class StoreAlertComponent implements OnInit, OnDestroy {
  storeAlerts?: IStoreAlert[];
  eventSubscriber?: Subscription;

  constructor(protected storeAlertService: StoreAlertService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.storeAlertService.query().subscribe((res: HttpResponse<IStoreAlert[]>) => {
      this.storeAlerts = res.body ? res.body : [];
    });
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInStoreAlerts();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IStoreAlert): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInStoreAlerts(): void {
    this.eventSubscriber = this.eventManager.subscribe('storeAlertListModification', () => this.loadAll());
  }

  delete(storeAlert: IStoreAlert): void {
    const modalRef = this.modalService.open(StoreAlertDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.storeAlert = storeAlert;
  }
}
