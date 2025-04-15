import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  pluckItemWrapperData,
  wrapJsonForRequest
} from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import {
  ResponseItemWrapper
} from '../models/response-wrappers.types';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/queue/createParameterBooking`, wrapJsonForRequest(data));
  }

  getTimeSlotList(): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/queue/getTimeSlotList`, {})
      .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
        map((p: any) => {
          return p;
        })
      )
  }
  getParameterBookingList(): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/queue/getParameterBookingList`, {})
      .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
        map((p: any) => {
          return p;
        })
      )
  }

}
