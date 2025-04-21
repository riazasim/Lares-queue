import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ResponseItemWrapper
} from '../models/response-wrappers.types';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(private http: HttpClient) { }

  probabaleTransactions(): Observable<Blob> {
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/report/downloadProbableQueueDetailCSV`, {}, {
      responseType: 'blob'
    });
  }
  worstTransactions(): Observable<Blob> {
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/report/downloadWorstQueueDetailCSV`, {}, {
      responseType: 'blob'
    });
  }
  probabaleQueue(): Observable<Blob> {
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/report/downloadProbableQueueDetailCSV`, {}, {
      responseType: 'blob'
    });
  }
  worstQueue(): Observable<Blob> {
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/report/downloadWorstQueueDetailCSV`, {}, {
      responseType: 'blob'
    });
  }

  // initialQueueDetailCSV(): Observable<any> {
  //   return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/report/downloadInitialQueueDetailCSV`, {});
  // }

}
