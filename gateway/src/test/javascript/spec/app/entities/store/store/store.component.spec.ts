import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { GatewayTestModule } from '../../../../test.module';
import { StoreComponent } from 'app/entities/store/store/store.component';
import { StoreService } from 'app/entities/store/store/store.service';
import { Store } from 'app/shared/model/store/store.model';

describe('Component Tests', () => {
  describe('Store Management Component', () => {
    let comp: StoreComponent;
    let fixture: ComponentFixture<StoreComponent>;
    let service: StoreService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GatewayTestModule],
        declarations: [StoreComponent],
        providers: []
      })
        .overrideTemplate(StoreComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(StoreComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(StoreService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Store(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.stores && comp.stores[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
