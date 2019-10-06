import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { HttpLoaderFactory } from './flight-search.module';
import { FlightSearchComponent } from './flight-search.component';

describe('FlightSearchComponent', () => {
  let component: FlightSearchComponent;
  let fixture: ComponentFixture<FlightSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        NgbModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        Ng2SmartTableModule
      ],
      declarations: [FlightSearchComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty',
    () => {
      component.ngOnInit();
      expect(component.searchForm.valid).toBeFalsy();
    });

  it('departure airport validity',
    () => {
      component.ngOnInit();
      const control = component.controls['departureAirport'];
      expect(control.valid).toBeFalsy();
      let errors = {};
      errors = control.errors;
      expect(errors['required']).toBeTruthy();
      control.setValue('test');
      expect(control.valid).toBeFalsy();
      errors = control.errors;
      expect(errors['pattern']).toBeTruthy();
    });

  it('departure date validity',
    () => {
      component.ngOnInit();
      const control = component.controls['departureDate'];
      expect(control.valid).toBeFalsy();
      let errors = {};
      errors = control.errors;
      expect(errors['required']).toBeTruthy();
      control.setValue('test');
      expect(control.valid).toBeFalsy();
      errors = control.errors;
      expect(errors['dateFormat']).toBeTruthy();
      control.setValue({ day: 4, month: 10, year: 2019 });
      expect(control.valid).toBeFalsy();
      errors = control.errors;
      expect(errors['beforeToday']).toBeTruthy();
    });

  it('arrival airport validity',
    () => {
      component.ngOnInit();
      const control = component.controls['arrivalAirport'];
      expect(control.valid).toBeFalsy();
      let errors = {};
      errors = control.errors;
      expect(errors['required']).toBeTruthy();
      control.setValue('test');
      expect(control.valid).toBeFalsy();
      errors = control.errors;
      expect(errors['pattern']).toBeTruthy();
    });

  it('return date validity',
    () => {
      component.ngOnInit();
      const control = component.controls['returnDate'];
      expect(control.valid).toBeFalsy();
      let errors = {};
      errors = control.errors;
      expect(errors['required']).toBeTruthy();
      control.setValue('test');
      expect(control.valid).toBeFalsy();
      errors = control.errors;
      expect(errors['dateFormat']).toBeTruthy();
      control.setValue({ day: 4, month: 10, year: 2019 });
      expect(control.valid).toBeFalsy();
      errors = control.errors;
      expect(errors['beforeToday']).toBeTruthy();
      const departureDateControl = component.controls['departureDate'];
      departureDateControl.setValue({ day: 19, month: 10, year: 2019 });
      control.setValue({ day: 18, month: 10, year: 2019 });
      expect(control.valid).toBeFalsy();
      errors = control.errors;
      expect(errors['beforeDate']).toBeTruthy();
    });

});
