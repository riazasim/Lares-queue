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

  update(data: any): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/queue/updateParameterQueueSetting`, data);
  }
  
  getParameterQueueSetting(): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/queue/getParameterQueueSetting`, {})
    .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
    map((p: any) => {
      return p;
    })
  )
}

deleteQueue(): Observable<any> {
    // let data ={
    //   "shipId":id
    // }
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/queue/deleteQueue`, {})
  }
}
