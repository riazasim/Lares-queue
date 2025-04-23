import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ResponseItemWrapper
} from '../models/response-wrappers.types';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient) { }

  getProcessId(): Observable<any> {
    return this.http.get<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getProcessId`);
  }
  checkExpiration(): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/checkTokenExpiration`, {});
  }
}
