import { Component, OnInit} from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import * as moment from 'moment';
import { Flight } from '../../models/flight';
import { Request } from '../../models/request';
import { FlightService } from '../../services/flight.service';
import { NotBeforeToday, NotBeforeControlDate } from '../../validation/custom-validators';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit {
  private source: LocalDataSource;
  private flights: Observable<Flight[]>;
  private inProgress = false;
  private minDate: NgbDate;

  searchForm: FormGroup;
  submitted = false;
  settings: any;

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    private calendar: NgbCalendar,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.initTableSettings();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.use(event.lang);
      // every time the languages will change, we reload the settings
      this.initTableSettings();
    });
  }

  ngOnInit() {
    this.searchForm = this.buildForm();
    this.minDate = this.calendar.getToday();
    this.submitted = false;
    this.flights = null;
  }

  initTableSettings(): void {
    this.settings = {
      pager: {
        display: true,
        perPage: 5
      },
      actions: {
        add: false,
        edit: false,
        delete: false
      },
      columns: {
        AirlineName: {
          title: this.translate.instant('AIRLINE'),
          type: 'html',
          valuePrepareFunction: (cell, row) => { return '<img src= ' + row['AirlineLogoAddress'] + '  /> <pre>' + cell + '</pre>' }
        },
        OutboundFlightsDuration: {
          title: this.translate.instant('OUTBOUND-DURATION')
        },
        InboundFlightsDuration: {
          title: this.translate.instant('INBOUND-DURATION')
        },
        TotalAmount: {
          title: this.translate.instant('TOTAL-AMOUNT'),
          valuePrepareFunction: (value) => { return '$' + value }
        },
      }
    };
  }

  buildForm(): FormGroup {
    return this.fb.group({
      searchGroup: this.fb.group({
        departureAirport: [
          null,
          [Validators.required, Validators.pattern('^[a-zA-Z0-9]{3}$')]
        ],
        departureDate: [
          null,
          [Validators.required, NotBeforeToday]
        ],
        arrivalAirport: [
          null,
          [Validators.required, Validators.pattern('^[a-zA-Z0-9]{3}$')]
        ],
        returnDate: [
          null,
          [Validators.required, NotBeforeToday]
        ],
      }, {
        validator: NotBeforeControlDate('returnDate', 'departureDate')
      })
    });
  }

  get controls() { return (this.searchForm.controls.searchGroup as FormGroup).controls; }

  onSubmit() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    this.flights = null;
    this.inProgress = true;
    const departureAirport = this.searchForm.get('searchGroup.departureAirport').value;
    const arriveAirport = this.searchForm.get('searchGroup.arrivalAirport').value;
    const departureDay = this.searchForm.get('searchGroup.departureDate').value;
    const returnDay = this.searchForm.get('searchGroup.returnDate').value;
    let dateString = `${departureDay.year}-${departureDay.month}-${departureDay.day}`;
    const departureDate = moment(dateString, 'YYYY-MM-DD').format('YYYY-MM-DDTHH:mm:ssZ');
    dateString = `${returnDay.year}-${returnDay.month}-${returnDay.day}`;
    const returnDate = moment(dateString, 'YYYY-MM-DD').format('YYYY-MM-DDTHH:mm:ssZ');
    const request = {
      DepartureAirportCode: departureAirport,
      ArrivalAirportCode: arriveAirport,
      DepartureDate: departureDate,
      ReturnDate: returnDate
    } as Request;
    this.flights = this.flightService.getFlights(request);
    this.flights.subscribe(data => {
      this.inProgress = false;
      this.source = new LocalDataSource(data);
    });
  }
}
