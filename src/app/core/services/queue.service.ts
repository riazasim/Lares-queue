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
export class QueueService {
  constructor(private http: HttpClient) { }

  simulate(): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/simulate`, {});
  }
  

}
