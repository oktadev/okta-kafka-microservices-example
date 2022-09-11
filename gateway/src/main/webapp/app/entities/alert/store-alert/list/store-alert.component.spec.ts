import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StoreAlertService } from '../service/store-alert.service';

import { StoreAlertComponent } from './store-alert.component';

describe('StoreAlert Management Component', () => {
  let comp: StoreAlertComponent;
  let fixture: ComponentFixture<StoreAlertComponent>;
  let service: StoreAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'store-alert', component: StoreAlertComponent }]), HttpClientTestingModule],
      declarations: [StoreAlertComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(StoreAlertComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StoreAlertComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StoreAlertService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.storeAlerts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to storeAlertService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getStoreAlertIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getStoreAlertIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
