import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { GatewayTestModule } from '../../../../test.module';
import { MockEventManager } from '../../../../helpers/mock-event-manager.service';
import { MockActiveModal } from '../../../../helpers/mock-active-modal.service';
import { StoreAlertDeleteDialogComponent } from 'app/entities/alert/store-alert/store-alert-delete-dialog.component';
import { StoreAlertService } from 'app/entities/alert/store-alert/store-alert.service';

describe('Component Tests', () => {
  describe('StoreAlert Management Delete Component', () => {
    let comp: StoreAlertDeleteDialogComponent;
    let fixture: ComponentFixture<StoreAlertDeleteDialogComponent>;
    let service: StoreAlertService;
    let mockEventManager: MockEventManager;
    let mockActiveModal: MockActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GatewayTestModule],
        declarations: [StoreAlertDeleteDialogComponent]
      })
        .overrideTemplate(StoreAlertDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(StoreAlertDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(StoreAlertService);
      mockEventManager = TestBed.get(JhiEventManager);
      mockActiveModal = TestBed.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.closeSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.clear();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
      });
    });
  });
});
