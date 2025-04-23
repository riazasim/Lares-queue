import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ResponseItemWrapper
} from '../models/response-wrappers.types';
import { pluckItemWrapperData } from 'src/app/shared/utils/api.functions';

@Injectable({
  providedIn: 'root'
})
export class ParametersQueueService {
  constructor(private http: HttpClient) { }

  setParams(data: any): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/setQueueParameters`, data);
  }

  getParameterQueueSetting(): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getQueueParameters`, {})
      .pipe(map(x => x.data))
  }

  getBookingCounts(): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/bookings/count`, {})
      .pipe(map(x => x.data))
  }

  deleteQueue(): Observable<any> {
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/queue/deleteQueue`, {})
  }
}
