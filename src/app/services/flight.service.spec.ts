import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { FlightService } from './flight.service';
import { ErrorHandleService } from './error-handle.service';
import { Constants } from '../../app/app.constants';
import { Flight } from '../models/flight';
import { Request } from '../models/request';

describe('FlightService', () => {
  let service: FlightService;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [FlightService, ErrorHandleService]
    });
    service = TestBed.get(FlightService);
    httpTestingController = TestBed.get(HttpTestingController);
  }));

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: FlightService = TestBed.get(FlightService);
    expect(service).toBeTruthy();
  });

  it('should get flights info', () => {
    const result = [
      {
        AirlineLogoAddress: 'http://nmflightapi.azurewebsites.net/Images/AirlineLogo/CZ.gif',
        AirlineName: 'China Southern Airlines',
        InboundFlightsDuration: '24:10',
        OutboundFlightsDuration: '26:20',
        TotalAmount: 2903.84
      },
      {
        AirlineLogoAddress: 'http://nmflightapi.azurewebsites.net/Images/AirlineLogo/EK.gif',
        AirlineName: 'Emirates Airline',
        InboundFlightsDuration: '42:55',
        OutboundFlightsDuration: '25:40',
        TotalAmount: 2954.14
      }
    ];
    const request = {
      DepartureAirportCode: 'MEI', ArrivalAirportCode: 'LHR',
      DepartureDate: '2019-10-05T00:00:00+11:00', ReturnDate: '2013-01-03T00:00:00+11:00'
    };
    service.getFlights(request)
      .subscribe(
        (data: Flight[]) => {
          expect(data.length).toEqual(2);
          expect(data[0].AirlineName).toEqual('China Southern Airlines');
          expect(data[1].AirlineName).toEqual('Emirates Airline');
        },
        (err) => expect(err).toBeNull()
      );
    const uri = decodeURIComponent(
      `${Constants.flightAPIUrl}?DepartureAirportCode=${request.DepartureAirportCode}&ArrivalAirportCode=${request.ArrivalAirportCode}` +
      `&DepartureDate=${request.DepartureDate}&ReturnDate=${request.ReturnDate}`);

    const req: TestRequest = httpTestingController.expectOne(req => req.url.includes(uri));

    expect(req.request.method).toEqual('GET');

    req.flush(result);
  });
});
