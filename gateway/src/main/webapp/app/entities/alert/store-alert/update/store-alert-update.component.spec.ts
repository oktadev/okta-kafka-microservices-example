import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StoreAlertFormService } from './store-alert-form.service';
import { StoreAlertService } from '../service/store-alert.service';
import { IStoreAlert } from '../store-alert.model';

import { StoreAlertUpdateComponent } from './store-alert-update.component';

describe('StoreAlert Management Update Component', () => {
  let comp: StoreAlertUpdateComponent;
  let fixture: ComponentFixture<StoreAlertUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let storeAlertFormService: StoreAlertFormService;
  let storeAlertService: StoreAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StoreAlertUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(StoreAlertUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StoreAlertUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    storeAlertFormService = TestBed.inject(StoreAlertFormService);
    storeAlertService = TestBed.inject(StoreAlertService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const storeAlert: IStoreAlert = { id: 456 };

      activatedRoute.data = of({ storeAlert });
      comp.ngOnInit();

      expect(comp.storeAlert).toEqual(storeAlert);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStoreAlert>>();
      const storeAlert = { id: 123 };
      jest.spyOn(storeAlertFormService, 'getStoreAlert').mockReturnValue(storeAlert);
      jest.spyOn(storeAlertService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ storeAlert });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: storeAlert }));
      saveSubject.complete();

      // THEN
      expect(storeAlertFormService.getStoreAlert).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(storeAlertService.update).toHaveBeenCalledWith(expect.objectContaining(storeAlert));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStoreAlert>>();
      const storeAlert = { id: 123 };
      jest.spyOn(storeAlertFormService, 'getStoreAlert').mockReturnValue({ id: null });
      jest.spyOn(storeAlertService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ storeAlert: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: storeAlert }));
      saveSubject.complete();

      // THEN
      expect(storeAlertFormService.getStoreAlert).toHaveBeenCalled();
      expect(storeAlertService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStoreAlert>>();
      const storeAlert = { id: 123 };
      jest.spyOn(storeAlertService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ storeAlert });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(storeAlertService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
