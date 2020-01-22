import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { GatewayTestModule } from '../../../../test.module';
import { StoreAlertComponent } from 'app/entities/alert/store-alert/store-alert.component';
import { StoreAlertService } from 'app/entities/alert/store-alert/store-alert.service';
import { StoreAlert } from 'app/shared/model/alert/store-alert.model';

describe('Component Tests', () => {
  describe('StoreAlert Management Component', () => {
    let comp: StoreAlertComponent;
    let fixture: ComponentFixture<StoreAlertComponent>;
    let service: StoreAlertService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GatewayTestModule],
        declarations: [StoreAlertComponent],
        providers: []
      })
        .overrideTemplate(StoreAlertComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(StoreAlertComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(StoreAlertService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new StoreAlert(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.storeAlerts && comp.storeAlerts[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
