import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StoreAlertDetailComponent } from './store-alert-detail.component';

describe('StoreAlert Management Detail Component', () => {
  let comp: StoreAlertDetailComponent;
  let fixture: ComponentFixture<StoreAlertDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreAlertDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ storeAlert: { id: 123 } }) },
        },
      ],
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
      expect(comp.storeAlert).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
