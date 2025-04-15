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
export class AccessPointsService {
  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/queue/createParameterAccessPoint`, data);
  }

  delete(id: number): Observable<any> {
    let data = {
      "parameterAccessPointId": id
    }
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/queue/deleteParameterAccessPoint`, wrapJsonForRequest(data))
  }

  getAccessPointsList(): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/queue/getParameterAccessPointList`, {})
      .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
        map((p: any) => {
          return p;
        })
      )
  }

}
