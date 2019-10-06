import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Constants } from '../../app/app.constants';
import { ErrorHandleService } from './error-handle.service';
import { Flight } from '../models/flight';
import { Request } from '../models/request';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(
    private http: HttpClient,
    private errorHandleService: ErrorHandleService
  ) { }

  getFlights(request: Request): Observable<Flight[]> {
    const uri = decodeURIComponent(
      `${Constants.flightAPIUrl}?DepartureAirportCode=${request.DepartureAirportCode}&ArrivalAirportCode=${request.ArrivalAirportCode}` +
      `&DepartureDate=${request.DepartureDate}&ReturnDate=${request.ReturnDate}`);
    return this.http.get<Flight[]>(uri)
      .pipe(
        map(res => (res as Flight[]).map(o => {
          return {
            AirlineLogoAddress: o.AirlineLogoAddress,
            AirlineName: o.AirlineName,
            InboundFlightsDuration: o.InboundFlightsDuration,
            OutboundFlightsDuration: o.OutboundFlightsDuration,
            TotalAmount: o.TotalAmount
          };
        })),
        tap(_ => console.log('fetched flights')),
        catchError(this.errorHandleService.handleError('getFlights', []))
      );
  }

}
