import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GatewayTestModule } from '../../../../test.module';
import { StoreAlertDetailComponent } from 'app/entities/alert/store-alert/store-alert-detail.component';
import { StoreAlert } from 'app/shared/model/alert/store-alert.model';

describe('Component Tests', () => {
  describe('StoreAlert Management Detail Component', () => {
    let comp: StoreAlertDetailComponent;
    let fixture: ComponentFixture<StoreAlertDetailComponent>;
    const route = ({ data: of({ storeAlert: new StoreAlert(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GatewayTestModule],
        declarations: [StoreAlertDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(StoreAlertDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(StoreAlertDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load storeAlert on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.storeAlert).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
